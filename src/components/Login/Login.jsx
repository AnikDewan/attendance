import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.css";
const URL = import.meta.env.VITE_API_URL;
const SIGNUP = import.meta.env.VITE_SIGN_UP;

const Login = () => {
	const [type, setType] = useState(!SIGNUP);
	const [showPass, setShowPass] = useState(false);
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch(`${URL}${type ? "signin" : "signup"}`, {
			method: "POST",
			body: JSON.stringify({ name: name, password: password }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const token = await response.json();
		if (token.error) {
			setName("");
			setPassword("");
			alert(token.error);
		} else {
			localStorage.setItem("auth-token", token);
			navigate("/");
		}
	};
	return (
		<div className="wrapper">
			<div className="container">
				<div className="heading">Sign {type ? "In" : "Up"}</div>
				<form className="form" onSubmit={handleSubmit}>
					<input
						required
						className="input"
						type="text"
						name="name"
						id="name"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						required
						className="input"
						type={showPass ? "text" : "password"}
						name="password"
						id="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<FontAwesomeIcon
						className="eye"
						onClick={() => {
							setShowPass(!showPass);
						}}
						icon={showPass ? faEye : faEyeSlash}
					/>
					<input
						className="login-button"
						type="submit"
						value={`Sign ${type ? "In" : "Up"}`}
					/>
				</form>
				{!!SIGNUP && (
					<p className="signin">
						{type ? "Don't" : "Already"} have an acount?
						<strong onClick={() => setType(!type)}>
							{" "}
							Sign {type ? "Up" : "In"}
						</strong>
					</p>
				)}
			</div>
		</div>
	);
};
export default Login;
