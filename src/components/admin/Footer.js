import React, {Component} from "react";

export class Footer extends Component{
    render() {
        return(
            <div className="footer">
                <ul>
                    <li><p>Evoke Technologies Pvt Ltd © 2021 All Rights Reserved</p></li>
                    <li><a href="mailto:uiuxpractice@evoketechnologies.com?subject=Feedback">Provide Feedback</a></li>
                </ul>
            </div>
        );
    }
}
export default Footer;