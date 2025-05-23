import React, { useState } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { contactConfig } from "../../content_option";

// Ensure that `fbq` is available globally
if (typeof window !== "undefined" && window.fbq) {
  window.fbq('track', 'PageView'); // Ensure the initial 'PageView' event is tracked.
}

// Helper function to update the URL query parameters without reloading the page.
const updateURLParameters = (params) => {
  // Create a new URL object based on the current location
  const url = new URL(window.location);
  // Iterate over the keys in the `params` object
  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });
  // Push the new URL state to the browser history
  window.history.pushState({}, '', url);
};



export const ContactUs = () => {
  const [formData, setFormdata] = useState({
    email: "abd@gmail.com",
    name: "ok",
    gender: "Male",
    message: "i am not diabetic",
    loading: false,
    show: false,
    alertmessage: "",
    variant: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();


    updateURLParameters({ 
      email: formData.email, 
      name: formData.name,
      gender: formData.gender,
      query: formData.message,

    });
  
  
    setFormdata({ ...formData, loading: true });
    if(window.fbq) {
      window.fbq('trackCustom', 'searchquery', {query: formData.message})
    }


    const templateParams = {
      from_name: formData.email,
      user_name: formData.name,
      to_name: contactConfig.YOUR_EMAIL,
      message: formData.message,
    };

    emailjs
      .send(
        contactConfig.YOUR_SERVICE_ID,
        contactConfig.YOUR_TEMPLATE_ID,
        templateParams,
        contactConfig.YOUR_USER_ID
      )
      .then(
        (result) => {
          console.log(result.text);
          setFormdata({
            email: "",
            name: "",
            message: "",
            loading: false,
            alertmessage: "SUCCESS! ,Thank you for your message",
            variant: "success",
            show: true,
          });
        },
        (error) => {
          console.log(error.text);
          setFormdata({
            ...formData,
            loading: false,
            alertmessage: `Failed to send! ${error.text}`,
            variant: "danger",
            show: true,
          });
        }
      );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });

    // Send event to Meta Pixel when user types in the name field
    if (name === "name" && window.fbq) {
      // window.fbq('trackCustom', 'UserNameInput', {userName: value})
      window.fbq('trackCustom', 'DOB', {dob: value})
      // window.fbq('trackCustom', 'query', {query: value})
      // window.fbq('trackCustom', 'FIRSTNAME', {firstname: value})
      // window.fbq('trackCustom', 'dateofbirth', {DOB: value})



      // window.fbq('track','Subscribe');
      // window.fbq('track', 'Purchase', {currency: "USD", value: 30.00});
    }

    if (name === "message" && window.fbq) {
      // window.fbq('trackCustom', 'UserNameInput', {userName: value})
      // window.fbq('trackCustom', 'DOB', {dob: value})
      window.fbq('trackCustom', 'ConfirmPassword', {confirm_password: value})
      window.fbq('trackCustom', 'SSN', {ssn: value})




      // window.fbq('track','Subscribe');
      // window.fbq('track', 'Purchase', {currency: "USD", value: 30.00});
    }


  };

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Contact</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Contact Me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="12">
            <Alert
              variant={formData.variant}
              className={`rounded-0 co_alert ${
                formData.show ? "d-block" : "d-none"
              }`}
              onClose={() => setFormdata({ ...formData, show: false })}
              dismissible
            >
              <p className="my-0">{formData.alertmessage}</p>
            </Alert>
          </Col>
          <Col lg="5" className="mb-5">
            <h3 className="color_sec py-4">Get in touch</h3>
            <address>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>
                {contactConfig.YOUR_EMAIL}
              </a>
              <br />
              <br />
              {contactConfig.hasOwnProperty("YOUR_FONE") ? (
                <p>
                  <strong>Phone:</strong> {contactConfig.YOUR_FONE}
                </p>
              ) : (
                ""
              )}
            </address>
            <p>{contactConfig.description}</p>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="contact__form w-100">
              <Row>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name || ""}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <textarea
                className="form-control rounded-0"
                id="message"
                name="message"
                placeholder="Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <br />
              <Row>
                <Col lg="12" className="form-group">
                  <button className="btn ac_btn" type="submit">
                    {formData.loading ? "Sending..." : "Send"}
                  </button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={formData.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
