import React from "react";

function Messages(props) {

    let message = null;

    if (props.role === "user") {
        message = <div className="user-message">{props.content}</div>;
    }
    else {
        message = <div className="ai-message">{props.content}</div>;
    }

    return (
        <div style={{width: '100%'}}>{message}</div>
    );
}

export default Messages;