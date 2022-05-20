import React from "react";
import { useParams } from "react-router-dom";
import verifyUser from "../services/authService";

const Welcome = () => {
    const url = useParams()

    verifyUser(url.confirmationCode);

    return (
        <div>
            <header>
                <h3>
                    <strong>Account confirmed!</strong>
                </h3>
            </header>
        </div>
    );
};

export default Welcome;