import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ToggleButtonGroup, ToggleButton, Modal, Spinner, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import moment from 'moment';
import Upload from '../../assets/images/upload.svg';
import Download from '../../assets/images/download.svg';
// Helpers
import { getApiUrl } from '../utils/helper';
import './Container.css'

toast.configure();

// default fotm data
const defaultFormData = {
    softwareName: '',
    softwareType: 'software',
    team: '',
    owner: '',
    email: '',
    websiteUrl: '',
    billingCycle: 'monthly',
    nextBilling: moment().format('YYYY-MM-DD'),
    billingDetails: {}, // pricingInDollar pricingInRupee billingMonth nextBilling, desc, invoiceFiles
};

const nonMandatoryFields = [
    'websiteUrl',
    'invoiceFiles',
    'pricingInDollar',
    'pricingInRupee',
    'description'
];

function UpdateForm({
    isOpen,
    closeModal,
    rowData,
    isEdit = false,
    updateToolStatus,
    selectedMonth,
    type,
    selectedYear
}) {
    const inputRef = useRef(null);
    const [state, setState] = useState({});
    const [invoiceFiles, setInvoiceFiles] = useState([]);
    const [billingDetails, setBillingDetails] = useState({ ...selectedMonth });
    const [isloading, setLoading] = useState(false)

    useEffect(() => {
        inputRef?.current?.focus();
        let stateData = billingDetails;
        if (isEdit) {
            stateData = {
                ...rowData,
                nextBilling: moment(rowData?.nextBilling)
                    .format('YYYY-MM-DD'),
            };
            const prevBillingDetails = {
                // ...rowData?.billingDetails?.[rowData.billingDetails.length - 1],
                ...(rowData?.billingCycle === 'monthly' && {
                    billingMonth: moment(rowData.nextBilling)
                        .format('MMMM')
                        .toLowerCase(),
                }),
                invoiceFiles: [],
                pricingInDollar: '',
                pricingInRupee: '',
            };
            delete prevBillingDetails._id;
            //setBillingDetails(prevBillingDetails);
        }
        setState(stateData);
    }, [isEdit, rowData]);
    const setTargetName = (value, e) => {
        if (value.match(/[a-zA-Z0-9]+([\s]+)*$/)) {
            setState({
                ...state,
                [e.target.name]: value,
            });
        } else {
            setState({
                ...state,
                [e.target.name]: '',
            });
        }
    };

    const getBillingDetails = (data) => {
        return data.match(/[a-zA-Z0-9]+([\s]+)*$/)
            ? data.replace(/[^a-zA-Z0-9 ]/g, '')
            : '';
    };
    const settingBillingDetails = (priceSection, value) => {
        return !priceSection ? value : '';
    };
    const billingCycle = (e) => {
        return e.target.value === 'monthly' ? 'month' : 'year';
    };
    /**
     * Setting billing details.
     *
     * @param {object} e contains event object.
     * @param {string} key contains string to check billing details.
     * @param {bool} priceSection contains boolean value.
     * @return null.
     */
    const handleOnChange = (e, key, priceSection, url = false) => {
        if (key === 'billingDetails') {
            let data = '';
            if (!priceSection) {
                data = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
            }
            const value = priceSection
                ? e.target.value.replace(/[^0-9.]/g, '')
                : getBillingDetails(data);
            setBillingDetails({
                ...billingDetails,
                [e.target.name]:
                    priceSection && value > 0
                        ? value
                        : settingBillingDetails(priceSection, value),
            });
        } else if (e.target.name === 'billingCycle') {
            setState({
                ...state,
                [e.target.name]: e.target.value,
                ...(e.target.name === 'billingCycle' && {
                    nextBilling: moment()
                        .format('YYYY-MM-DD'),
                }),
            });
        } else if (e.target.name === 'nextBilling') {
            setBillingDetails({
                ...billingDetails,
                [e.target.name]: e.target.value,
            });
        } else if (url) {
            const value = e.target.value.trim();
            setState({
                ...state,
                [e.target.name]: value,
            });
        } else {
            const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
            setTargetName(value, e);
        }
    };

    function handleEmailChange(e, email) {
        if (e.key === '@' && !state.autoFill && email) {
            setState({
                ...state,
                [e.target.name]: e.target.value + '@evoketechnologies.com',
                autoFill: true,
            });
        } else if (!state.autoFill) {
            setState({
                ...state,
                [e.target.name]: e.target.value,
                autoFill: false,
            });
        } else {
            setState({
                ...state,
                autoFill: false,
            });
        }
    }

    function ValidateEmail(inputText) {
        const mailTextformat =
            /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@evoketechnologies.com(\s*,\s*|\s*$))*$/;
        if (inputText.match(mailTextformat)) {
            return true;
        } else {
            toast.error('Invalid email ID !', {
                autoClose: 1800,
            });
            setLoading(false);
            return false;
        }
    }

    const handleCancel = () => {
        closeModal();
    }

    const uploadInvoiceFiles = (data, year, month) => {
        if (invoiceFiles && invoiceFiles.length > 0) {
            const formData = new FormData();
            for (let file in invoiceFiles) {
                formData.append('fileName', invoiceFiles[file]);
            }
            formData.append('year', year);
            formData.append('month', month);
            axios
                .post(getApiUrl(`softwareInfo/multiple/${data._id}`), formData)
                .then((res) => {
                    console.log('Files Uploaded : ', res.data.status);
                    toast.success('Files Uploaded Successfully !', {
                        autoClose: 1000,
                        onClose: updateToolStatus(true),
                    });
                })
                .catch((err) => {
                    console.log('Error in Upload : ', err);
                });
        } else {
            // toast.success('Data Saved Successfully !', {
            //     autoClose: 1000,
            //     onClose: updateToolStatus(true),
            // });
        }
    };
    const handleAddFile = () => {
        document.getElementById('invoiceFiles').click();
    };

    const addAttachment = (fileInput) => {
        const files = [...invoiceFiles];
        for (const file of fileInput.target.files) {
            files.push(file);
        }
        console.log('files', files);
        setInvoiceFiles(files);
    };


    const downloadInvoice = useCallback((invoiceFiles) => {
        axios
            .get(
                getApiUrl(`softwareInfo/download/${rowData._id}/${billingDetails.createdAt.substring(0, 4)}/${billingDetails.billingMonth}`)
            )
            .then((res) => {
                const files = res.data;
                downloadFiles(files, invoiceFiles);
            });
    }, []);

    const downloadFiles = (filesUrls, fileNames) => {
        let index = 0;
        for (let file of filesUrls) {
            const link = document.createElement('a');
            if (file.includes(fileNames)) {
                link.href = file;
                link.target = '_blank';
                link.setAttribute('id', 'downloadFile');
                link.setAttribute('download', fileNames);
                document.body.appendChild(link);
                link.click();
                index += 1;
                document.getElementById('downloadFile')?.remove();
            }

        }
    };

    /**
     * Displays the modal.
     *
     * @param {object} e contains event object.
     * @return null.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const newBillingRecord = {
            ...billingDetails,
            nextBilling: billingDetails.nextBilling,
            createdAt: moment().format('YYYY-MM-DD'),
        };

        let subscriptionYear = state.nextBilling.substring(0, 4);
        let subscriptionMonth = newBillingRecord.billingMonth;

        let billingInfo = {}; // {"2020" : ["Janauary","febrauary"] , "2021" : ["june","june","july"] , "2022" : ["august"] }

        if (isEdit && type == "renew") {
            let availableYears = Object.keys(state.billingDetails)
            availableYears.forEach(year => {
                let subscriptionDetails = state.billingDetails[year];
                let subscribedMonths = [];
                subscriptionDetails.forEach((subscriptionInfo) => {
                    if (!subscribedMonths.includes(subscriptionInfo.billingMonth)) {
                        subscribedMonths.push(subscriptionInfo.billingMonth)
                    }
                })
                billingInfo[year] = subscribedMonths
            });

            if (billingInfo[subscriptionYear] && billingInfo[subscriptionYear].includes(subscriptionMonth)) {
                toast.error(`Subscription already done for ${subscriptionMonth} , ${subscriptionYear}`, {
                    autoClose: 3000,
                });
                setLoading(false);
                return false;
            }
        }


        let softwareToolDetails = JSON.parse(JSON.stringify(state));
        if (Object.keys(softwareToolDetails.billingDetails).includes(selectedYear)) {
            if (type == "update") {
                let validmonth = false;
                softwareToolDetails.billingDetails[selectedYear].forEach(element => {
                    if (element.billingMonth == billingDetails.billingMonth) {
                        element.nextBilling = billingDetails.nextBilling;
                        element.description = billingDetails.description;
                        element.pricingInDollar = billingDetails.pricingInDollar;
                        element.pricingInRupee = billingDetails.pricingInRupee;
                        element.invoiceFiles = billingDetails.invoiceFiles;
                        validmonth = true;
                    }
                });

                if (!validmonth) {
                    toast.error(`Unable to update`, {
                        autoClose: 3000,
                    });
                    setLoading(false);
                    return false;
                }
            }
            else {
                softwareToolDetails.billingDetails[subscriptionYear].push(newBillingRecord);
            }

        } else {
            softwareToolDetails.billingDetails[subscriptionYear] = [newBillingRecord];
        }
        if (ValidateEmail(softwareToolDetails.email)) {
            const renewUrl = `softwareInfo/renew/${rowData?._id}`;
            axios
                .post(
                    `${isEdit ? getApiUrl(renewUrl) : getApiUrl('softwareInfo/create')}`,
                    softwareToolDetails
                )
                .then((res) => {
                    if (isEdit) {
                        let subscribedYears = Object.keys(res.data.billingDetails);
                        if (subscribedYears.includes(subscriptionYear)) {
                            let renewedSubscription = res.data.billingDetails[
                                subscriptionYear
                            ].filter((month, ind) => {
                                if (month.billingMonth === subscriptionMonth) {
                                    return month;
                                }
                            });
                            uploadInvoiceFiles(res.data, subscriptionYear, subscriptionMonth);
                        }
                    } else {
                        uploadInvoiceFiles(res.data, subscriptionYear, subscriptionMonth);
                        setState(defaultFormData);
                    }

                    closeModal();
                    toast.success('Data Saved Successfully !', {
                        autoClose: 1000,
                        onClose: updateToolStatus(true),
                    });
                    setLoading(false);
                });
        }
    };
    const mailformat =
        /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@evoketechnologies.com(\s*,\s*|\s*$))*$/;
    return (
        <Modal
            centered
            size='lg'
            style={{ borderRadius: '0 !important' }}
            show={isOpen}
            backdrop='static'
            onHide={closeModal}
            className='software-modal'
        >
            <Modal.Header closeButton className='modal-area'>
                <h3>Add Tool/Software</h3>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className='row'>
                        <div className='form-group col-md-4'>
                            <label htmlFor='softwareType'>Select Type *</label>
                            <ToggleButtonGroup
                                type='radio'
                                name='softwareType'
                                value={state?.softwareType}
                                disabled={isEdit}
                                onChange={(val) => setState({ ...state, softwareType: val })}
                            >
                                <ToggleButton
                                    disabled={isEdit}
                                    checked={state?.softwareType === 'certificate'}
                                    value={'certificate'}
                                    className='certificate'
                                >
                                    Certificate
                                </ToggleButton>
                                <ToggleButton
                                    disabled={isEdit}
                                    checked={state?.softwareType === 'domain'}
                                    value={'domain'}
                                    className='domian'
                                >
                                    Domain
                                </ToggleButton>
                                <ToggleButton
                                    disabled={isEdit}
                                    checked={state?.softwareType === 'software'}
                                    value={'software'}
                                    className='software'
                                >
                                    Software
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <div className='form-group col-md-4'>
                            <label htmlFor='softwareName'>Tool/Software *</label>
                            <input
                                type='text'
                                className='form-control'
                                onChange={handleOnChange}
                                name='softwareName'
                                disabled={isEdit}
                                value={state?.softwareName}
                            />
                        </div>
                        <div className='form-group col-md-4'>
                            <label htmlFor='websiteUrl'>URL </label>
                            <span className='help-text'>( Ex: https:// )</span>
                            <input
                                type='text'
                                className='form-control'
                                onChange={(e) => handleOnChange(e, '', false, true)}
                                name='websiteUrl'
                                disabled={isEdit}
                                value={state?.websiteUrl}
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='form-group col-md-4'>
                            <label htmlFor='team'>Team/Project/Business Unit *</label>
                            <input
                                type='text'
                                className='form-control'
                                onChange={handleOnChange}
                                name='team'
                                disabled={isEdit}
                                value={state?.team}
                            />
                        </div>
                        <div className='form-group col-md-4'>
                            <label htmlFor='owner'>User/Owner *</label>
                            <input
                                type='text'
                                className='form-control'
                                onChange={handleOnChange}
                                name='owner'
                                disabled={isEdit}
                                value={state?.owner}
                            />
                        </div>
                        <div className='form-group col-md-4'>
                            <label htmlFor='email'>Email Id * </label>
                            <span className='email-help-text'>
                                {' '}
                                (Add multiple emails with (,) separation)
                            </span>

                            <textarea
                                type='textarea'
                                className='form-control'
                                onChange={(e) => handleEmailChange(e, true)}
                                onKeyDown={(e) => handleEmailChange(e, true)}
                                disabled={isEdit}
                                name='email'
                                value={
                                    state.email &&
                                    state.email.match(mailformat) &&
                                    state.email.toLowerCase()
                                }
                                rows='3'
                                cols='50'
                            />
                        </div>
                    </div>

                    <div className='row'></div>
                    <div className='row'>
                        <div className='form-group col-md-4'>
                            <label htmlFor='billingCycle'>Billing Cycle *</label>
                            <ToggleButtonGroup
                                type='radio'
                                name='billingCycle'
                                value={state?.billingCycle}
                                disabled={isEdit}
                                onChange={(val) =>
                                    handleOnChange({
                                        target: { name: 'billingCycle', value: val },
                                    })
                                }
                            >
                                <ToggleButton
                                    disabled={isEdit}
                                    checked={state?.billingCycle === 'monthly'}
                                    value={'monthly'}
                                >
                                    Monthly
                                </ToggleButton>
                                <ToggleButton
                                    disabled={isEdit}
                                    checked={state?.billingCycle === 'yearly'}
                                    value={'yearly'}
                                    className='yearly'
                                >
                                    Yearly
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>

                        <div className='form-group col-md-2'>
                            <label htmlFor='billingMonth'>For the month of </label>
                            <select
                                className='form-control'
                                onChange={(e) => handleOnChange(e, 'billingDetails')}
                                name='billingMonth'
                                value={billingDetails?.billingMonth}
                                //value={selectedMonth.billingMonth}
                                disabled={state?.billingCycle === 'yearly' || isEdit}
                            >
                                <option value='january'>January</option>
                                <option value='february'>February</option>
                                <option value='march'>March</option>
                                <option value='april'>April</option>
                                <option value='may'>May</option>
                                <option value='june'>June</option>
                                <option value='july'>July</option>
                                <option value='august'>August</option>
                                <option value='september'>September</option>
                                <option value='october'>October</option>
                                <option value='november'>November</option>
                                <option value='december'>December</option>
                            </select>
                        </div>

                        <div className='form-group col-md-2'>
                            <label htmlFor='nextBilling'>Next Billing Date </label>
                            <input
                                type='date'
                                className='form-control'
                                onChange={handleOnChange}
                                name='nextBilling'
                                value={billingDetails?.nextBilling}
                                //value={selectedMonth.nextBilling}
                                // min={moment().subtract(1, 'month').format('YYYY-MM-DD')}
                                max={
                                    state.billingCycle === 'yearly'
                                        ? ''
                                        : moment().add(1, 'month').format('YYYY-MM-DD')
                                }
                            />
                        </div>
                        <div className='form-group col-md-2'>
                            <label htmlFor='pricingInDollar'>Pricing in $ </label>
                            <NumberFormat
                                thousandsGroupStyle='thousand'
                                prefix='$ '
                                decimalSeparator='.'
                                displayType='input'
                                type='text'
                                className='form-control'
                                onChange={(e) => handleOnChange(e, 'billingDetails', true)}
                                name='pricingInDollar'
                                value={billingDetails?.pricingInDollar}
                                //value = {selectedMonth.pricingInDollar}
                                thousandSeparator={true}
                                allowNegative={true}
                            />
                        </div>
                        <div className='form-group col-md-2'>
                            <label htmlFor='pricingInRupee'>Pricing in ₹ </label>
                            <NumberFormat
                                thousandsGroupStyle='thousand'
                                value={billingDetails?.pricingInRupee}
                                //value={selectedMonth.pricingInRupee}
                                prefix='₹ '
                                decimalSeparator='.'
                                displayType='input'
                                type='text'
                                name='pricingInRupee'
                                className='form-control'
                                onChange={(e) => handleOnChange(e, 'billingDetails', true)}
                                thousandSeparator={true}
                                allowNegative={true}
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='form-group col-md-6'>
                            <label htmlFor='description'>Pricing Description </label>
                            <textarea
                                type='text'
                                className='form-control long'
                                onChange={(e) => handleOnChange(e, 'billingDetails')}
                                name='description'
                                maxLength='250'
                                value={billingDetails?.description}
                                //value={selectedMonth.description}
                                style={{ resize: 'none' }}
                            />
                        </div>
                        <div className='form-group col-md-6'>
                            <label htmlFor='invoiceFiles'>Upload Invoice</label>
                            <div
                                className={`form-control long dashed-box  ${(billingDetails.invoiceFiles === null || billingDetails.invoiceFiles.length <= 0) &&
                                    'pointer'
                                    } ${(billingDetails.invoiceFiles === null || billingDetails.invoiceFiles.length > 0) &&
                                    'files-container'
                                    }`}
                            >

                                <div
                                    className={`${billingDetails.invoiceFiles.length <= 0 && 'no-selected-items'}
                                    ${billingDetails.invoiceFiles.length > 0 && 'selected-items'}`}
                                >
                                    {billingDetails.invoiceFiles.map((item, key) => (
                                        <div>
                                            <span
                                                key={key}
                                                className='file-close-icon'
                                                onClick={() => {
                                                    const fileState = [...invoiceFiles];
                                                    const fileState2 = [...billingDetails.invoiceFiles]
                                                    fileState.splice(key, 1);
                                                    fileState2.splice(key, 1);
                                                    setInvoiceFiles(fileState);
                                                    setBillingDetails({ ...billingDetails, invoiceFiles: fileState2 })
                                                }}
                                            >
                                                {/* {typeof(billingDetails.invoiceFiles[key]) == "string" ?billingDetails.invoiceFiles[key].split("_")[1]:billingDetails.invoiceFiles[key]["name"] } */}
                                                {billingDetails.invoiceFiles[key].includes("_") ? billingDetails.invoiceFiles[key].split("_")[1] : billingDetails.invoiceFiles[key]}
                                                &nbsp;&nbsp;
                                            </span>
                                            <img
                                                className='pl-3 pr-2 pointer'
                                                src={Download}
                                                onClick={() => downloadInvoice(billingDetails.invoiceFiles[key])}
                                                alt='download'
                                            />
                                        </div>
                                    ))}
                                    {invoiceFiles.map((item, key) => (
                                        <div>
                                            <span
                                                key={key}
                                                className='file-close-icon'
                                                onClick={() => {
                                                    const fileState = [...invoiceFiles];
                                                    fileState.splice(key, 1);
                                                    setInvoiceFiles(fileState);
                                                }}
                                            >
                                                {invoiceFiles[key].name}
                                                &nbsp;&nbsp;
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className='addFileBtn'>
                                    <a onClick={(e) => handleAddFile()} href='javascript:void(0)'>
                                        Add files here
                                        <img className='px-2' src={Upload} alt='download' />
                                    </a>
                                </div>
                            </div>
                            <input
                                id='invoiceFiles'
                                type='file'
                                name='invoiceFiles'
                                multiple // single file upload
                                className='form-control'
                                onChange={(e) => addAttachment(e)}
                                onClick={(e) => (e.target.value = null)}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div className='form-group row share '>
                        {isloading ? <Spinner animation="border" variant="info" className='spinnericon'/> : <div className='col-md-12 text-center'>
                            <button
                                className='form-control btn btn-primary'
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className='form-control btn btn-primary share-btn'
                                onClick={handleSubmit}
                                disabled={
                                    Object.keys(state).some((key) =>
                                        nonMandatoryFields.includes(key) ? false : state[key] === ''
                                    ) ||
                                    Object.keys(billingDetails).some((key) =>
                                        nonMandatoryFields.includes(key)
                                            ? false
                                            : billingDetails[key] === ''
                                    )
                                }
                            >
                                {isEdit ? 'Update' : 'Save'}
                            </button>

                        </div>}

                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}
export default UpdateForm;
