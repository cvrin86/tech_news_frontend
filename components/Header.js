import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { removeAllBookmarks } from "../reducers/bookmarks";
import { login, logout } from "../reducers/user";
import styles from "../styles/Header.module.css";

function Header() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [date] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerFormError },
    reset: resetRegisterForm,
  } = useForm({ mode: "onBlur" });

  const {
    register: connectForm,
    handleSubmit: handleConnectForm,
    formState: { errors: connectFormError },
    reset: resetConnectForm,
  } = useForm({ mode: "onBlur" });

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  async function handleLogout() {
    try {
      const res = await fetch(`${api}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      await res.json();
      dispatch(logout());
      dispatch(removeAllBookmarks());
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Network error during logout");
    }
  }

  const handleRegister = async (data) => {
    try {
      const res = await fetch(`${api}/users/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log("Response backend/signup:",res);
      

      const dataFromBack = await res.json();
      console.log("Data from back:", dataFromBack);
      if (dataFromBack.result) {
        resetRegisterForm();
        setIsModalVisible(false);
        toast.success("Account successfully created");
        dispatch(login({ username: data.username, isConnected: true }));
      } else {
        toast.error(dataFromBack.error || "Username already exists");
      }
    } catch (err) {
      toast.error("Network error during signup");
    }
  };

  const handleConnect = async (data) => {
    try {
      const res = await fetch(`${api}/users/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataFromBack = await res.json();
      if (dataFromBack.result) {
        resetConnectForm();
        setIsModalVisible(false);
        setErrorMsg("");
        toast.success("User successfully connected");
        dispatch(login({ username: data.username, isConnected: true }));
      } else {
        setErrorMsg("Wrong username / password");
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Network error during login");
    }
  };

  const modalContent = (
    <div className={styles.registerContainer}>
      <form onSubmit={handleRegisterSubmit(handleRegister)} className={styles.registerSection}>
        <p>Sign-up</p>
        <input
          type="text"
          placeholder="Username"
          {...registerForm("username", {
            required: "Username is required",
            minLength: { value: 3, message: "Username must have at least 3 characters" },
          })}
        />
        {registerFormError.username && <span className={styles.errorMsg}>{registerFormError.username.message}</span>}
        <input
          type="password"
          placeholder="Password"
          {...registerForm("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must contain at least 8 characters" },
          })}
        />
        {registerFormError.password && <span className={styles.errorMsg}>{registerFormError.password.message}</span>}
        <button>Register</button>
      </form>

      <form onSubmit={handleConnectForm(handleConnect)} className={styles.registerSection}>
        <p>Sign-in</p>
        <input
          type="text"
          placeholder="Username"
          {...connectForm("username", { required: "Username is required" })}
        />
        {connectFormError.username && <span className={styles.errorMsg}>{connectFormError.username.message}</span>}
        <input
          type="password"
          placeholder="Password"
          {...connectForm("password", { required: "Password is required" })}
        />
        {connectFormError.password && <span className={styles.errorMsg}>{connectFormError.password.message}</span>}
        {errorMsg && <span className={styles.errorMsg}>{errorMsg}</span>}
        <button>Connect</button>
      </form>
    </div>
  );

  let userSection;
  if (user.isConnected) {
    userSection = (
      <p>
        Welcome {user.username} / <button onClick={handleLogout}>Logout</button>
      </p>
    );
  } else {
    userSection = (
      <FontAwesomeIcon
        icon={isModalVisible ? faXmark : faUser}
        onClick={toggleModal}
        className={styles.userSection}
      />
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Moment className={styles.date} date={date} format="MMM Do YYYY" />
        <h1 className={styles.title}>Morning News</h1>
        {userSection}
      </div>

      <div className={styles.linkContainer}>
        <Link href="/" className={styles.link}>Articles</Link>
        {user.isConnected && <Link href="/bookmarks" className={styles.link}>Bookmarks</Link>}
      </div>

      {isModalVisible && (
        <div id="react-modals">
          <Modal
            getContainer="#react-modals"
            className={styles.modal}
            open={isModalVisible}
            closable={false}
            footer={null}
          >
            {modalContent}
          </Modal>
        </div>
      )}
    </header>
  );
}

export default Header;
