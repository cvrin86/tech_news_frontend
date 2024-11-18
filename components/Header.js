import { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd";
import Moment from "react-moment";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../reducers/user";
import { removeAllBookmarks } from "../reducers/bookmarks";

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [date, setDate] = useState("2050-11-22T23:59:59");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerFormError },
    reset: resetRegisterForm,
  } = useForm({
    mode: "onBlur",
  });

  const {
    register: connectForm,
    handleSubmit: handleConnectForm,
    formState: { errors: connectFormError },
    reset: resetConnectForm,
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    setDate(new Date());
  }, []);

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  async function handleLogout() {
    const res = await fetch("http://localhost:3011/users/logout", {
      method: "POST",
      credentials: "include",
    });
    await res.json();
    dispatch(logout());
    dispatch(removeAllBookmarks());
  }

  const handleRegister = async (data) => {
    const res = await fetch("http://localhost:3011/users/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const dataFromBack = await res.json();
    if (dataFromBack.result) {
      resetRegisterForm();
      setIsModalVisible(false);
      toast.success("Account successfully created");
      dispatch(login(data.username));
    } else {
      toast.error("Username already exists, please use another one", {
        position: "top-right",
      });
    }
  };

  const handleConnect = async (data) => {
    const res = await fetch("http://localhost:3011/users/signin", {
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
      dispatch(login(data.username));
    } else {
      setErrorMsg("Wrong username / password");
      toast.error("Invalid credentials", {
        position: "top-right",
      });
    }
  };

  const modalContent = (
    <div className={styles.registerContainer}>
      <form
        onSubmit={handleRegisterSubmit(handleRegister)}
        className={styles.registerSection}
      >
        <p>Sign-up</p>
        <input
          type="text"
          placeholder="Username"
          {...registerForm("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must have at least 3 characters",
            },
          })}
        />
        {registerFormError.username && (
          <span className={styles.errorMsg}>
            {registerFormError.username.message}
          </span>
        )}
        <input
          type="password"
          placeholder="Password"
          {...registerForm("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must contain at least 8 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must contain at least 1 upper case letter, 1 lower case letter, 1 number and 1 special character.",
            },
          })}
        />
        {registerFormError.password && (
          <span className={styles.errorMsg}>
            {registerFormError.password.message}
          </span>
        )}
        <button>Register</button>
      </form>
      <form
        onSubmit={handleConnectForm(handleConnect)}
        className={styles.registerSection}
      >
        <p>Sign-in</p>
        <input
          type="text"
          placeholder="Username"
          {...connectForm("username", {
            required: "Username is required",
          })}
        />
        {connectFormError.username && (
          <span className={styles.errorMsg}>
            {connectFormError.username.message}
          </span>
        )}
        <input
          type="password"
          placeholder="Password"
          {...connectForm("password", {
            required: "Password is required",
          })}
        />
        {connectFormError.password && (
          <span className={styles.errorMsg}>
            {connectFormError.password.message}
          </span>
        )}
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
    if (isModalVisible) {
      userSection = (
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => showModal()}
          className={styles.userSection}
        />
      );
    } else {
      userSection = (
        <FontAwesomeIcon
          icon={faUser}
          onClick={() => showModal()}
          className={styles.userSection}
        />
      );
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Moment className={styles.date} date={date} format="MMM Do YYYY" />
        <h1 className={styles.title}>Morning News</h1>
        {userSection}
      </div>

      <div className={styles.linkContainer}>
        <Link href="/" className={styles.link}>
          Articles
        </Link>
        <Link href="/bookmarks" className={styles.link}>
          Bookmarks
        </Link>
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
