// src/pages/LoginComps/EPSMSLogin.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AuthContext } from "../../contexts/AuthContext";
import { getUser } from "../../utils/storage";
import { AUTH_API } from "../../api/axios";
import esmLogo from "../../assets/ems_logo.png";

const ROLE_SMM_ROUTE = {
    default: "epsms/smm/dashboard",
};
const ALLOWED_USERNAME = "SMM_NONFARMLH";
const ALLOWED_ROLE_ID = 3;

const schema = yup.object({
    username: yup.string().required("Enter username"),
    password: yup.string().required("Enter password"),
});

export default function EPSMSLogin() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [captchaImage, setCaptchaImage] = useState("");
    const [captchaValue, setCaptchaValue] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const MAX_ATTEMPTS = 4;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const loadCaptcha = async () => {
        try {
            const res = await AUTH_API.captcha();
            setCaptchaImage(res.data.image);
        } catch (err) {
            console.error("Captcha load failed", err);
        }
    };

    useEffect(() => {
        loadCaptcha();
    }, []);

    const onSubmit = async (data) => {
        setCaptchaError("");

        // Inject the Admin userType required for the EPSMS portal
        const result = await login({
            ...data,
            userType: "Admin",
            captcha: captchaValue,
        });

        if (!result?.success) {
            const errorDetail =
                result?.error?.detail || "Login failed. Please try again.";
            const isCaptchaIssue = errorDetail.toLowerCase().includes("captcha");

            if (!isCaptchaIssue) setFailedAttempts((prev) => prev + 1);

            setCaptchaError(errorDetail);
            setCaptchaValue("");
            loadCaptcha();
            return;
        }

        setFailedAttempts(0);
        const backendUser = getUser();
        const backendRoleId = Number(backendUser?.role_id ?? backendUser?.role);

        if ((backendUser?.username || "").trim() !== ALLOWED_USERNAME) {
            alert("Only the NONFARM LH THEMATIC EXPERT account is allowed to log in here.");
            return;
        }

        if (backendRoleId !== ALLOWED_ROLE_ID) {
            alert("Only role ID 3 (SMMU) is allowed for this portal.");
            return;
        }

        navigate(`/epsms/smm/dashboard`);
    };

    return (
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="logo-header">
                <img src={esmLogo} alt="EPSMS Logo" className="app-logo" />
            </div>

            <div className="form-header-text">
                <h2>UDHYAM SAKHI MANAGEMENT SYSTEM PORTAL (EPSMS)</h2>
            </div>

            <label className="block-label">Username</label>
            <input className="form-input" {...register("username")} />

            <label className="block-label">Password</label>
            <div className="password-wrapper">
                <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    {...register("password")}
                />
                <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>

            {failedAttempts > 0 &&
                failedAttempts < MAX_ATTEMPTS &&
                !captchaError?.toLowerCase().includes("captcha") && (
                    <div className="error">
                        Wrong password. Attempts left: {MAX_ATTEMPTS - failedAttempts}
                    </div>
                )}

            <label className="block-label">Captcha</label>
            <div className="captcha-wrapper">
                <div className="captcha-image">
                    <img
                        src={captchaImage || undefined}
                        alt="captcha"
                        style={{ width: 180, height: 50 }}
                    />
                    <button type="button" onClick={loadCaptcha}>
                        Refresh
                    </button>
                </div>
                <input
                    type="text"
                    className="form-input captcha-input"
                    placeholder="Enter captcha"
                    style={{ textTransform: "uppercase" }}
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                />
            </div>

            {captchaError && <p className="error">{captchaError}</p>}

            {failedAttempts >= MAX_ATTEMPTS &&
                !captchaError?.toLowerCase().includes("captcha") && (
                    <div className="error">
                        Password incorrect. Too many failed attempts.
                    </div>
                )}

            <button className="log-in" type="submit">
                Log In
            </button>
        </form>
    );
}
