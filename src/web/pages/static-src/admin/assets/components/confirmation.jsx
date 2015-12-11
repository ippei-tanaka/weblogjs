import React from 'react';


class Confirmation extends React.Component {

    render() {
        return (
            <div className="module-confirmation">
                <p className="m-cfm-message">{this.props.children}</p>
                <ul className="m-cfm-button-list">
                    <li className="m-cfm-button-list-item">
                        <button className="module-button"
                                onClick={this.onClickOkay.bind(this)}>{this.props.okayLabel}</button>
                    </li>
                    {this.props.mode === "choose" ? (
                    <li className="m-cfm-button-list-item">
                        <button autoFocus={true}
                                className="module-button m-btn-alert"
                                onClick={this.onClickCancel.bind(this)}>{this.props.cancelLabel}</button>
                    </li>
                        ) : null}
                </ul>
            </div>
        );
    }

    onClickOkay(e) {
        e.preventDefault();
        this.props.onApproved.call(null);
    }

    onClickCancel(e) {
        e.preventDefault();
        this.props.onCanceled.call(null);
    }

}


Confirmation.defaultProps = {
    mode: "", // 'choose' or 'confirm'
    okayLabel: "Okay",
    cancelLabel: "Cancel",
    onApproved: function () {
    },
    onCanceled: function () {
    }
};


export default Confirmation;

