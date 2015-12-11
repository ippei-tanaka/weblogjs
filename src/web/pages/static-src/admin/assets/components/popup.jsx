import React from 'react';


class PopUp extends React.Component {

    render() {
        return (
            <div className="module-popup">
                <div className="m-ppp-wrapper1">
                    <div className="m-ppp-wrapper2">
                        <div className="m-ppp-frame">
                            <button className="module-button m-btn-clear m-ppp-close-button"
                                    onClick={this.onClickCloseButton.bind(this)}>
                                <i className="fa fa-times m-ppp-close-icon"/>
                            </button>
                            <div className="m-ppp-content-container">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="m-ppp-background" onClick={this.onClickBackground.bind(this)}></div>
            </div>
        );
    }

    onClickBackground(e) {
        e.preventDefault();
        this.close();
    }

    onClickCloseButton(e) {
        e.preventDefault();
        this.close();
    }

    close() {
        this.props.onClosed.call(null);
    }

}


PopUp.defaultProps = {
    onClosed: function () {
    }
};


export default PopUp;