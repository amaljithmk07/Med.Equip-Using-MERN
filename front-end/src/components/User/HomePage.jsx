import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Base_URL from "../Constant/constant";
import toast from "react-hot-toast";
import "aos/dist/aos.css";
import AOS from "aos";
import Loader from "../loader/Loader";

const HomePage = () => {
  const [product, setproduct] = useState([]);

  const token = sessionStorage.getItem("Token");
  const role = sessionStorage.getItem("Role");
  console.log(token);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    AOS.init();
    setLoad(true);

    axios
      .get(`${Base_URL}/api/user/demo-view`, {})
      .then((data) => {
        console.log(data.data.data);
        const approvedproducts = data.data.data.filter((data) => {
          return data.product_status == "Approved";
        });
        setLoad(false);
        setproduct(approvedproducts);
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
        toast.error(err, {
          position: "bottom-center",
        });
      });
  }, []);

  const cardError = () => {
    toast.error("You need to login first", {
      position: "bottom-center",
    });
  };
  return (
    <div>
      <div className="homemain-body">
        <div className="homeproduct-sub-body">
          <div className="homeproduct-content">
            <div className="home-head">Medical Equipment</div>
            <div className="homeproduct-image">
              {/* <img src="/donate.png" alt="" className="home-img" /> */}
              <img
                src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583148/Med-equip/tgngjojizoxnkjkdv6ac.png"
                alt=""
                className="home-img"
              />
              {/* <img src="/refurbish.png" alt="" className="home-img" /> */}
              <img
                src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583161/Med-equip/rfa9t9byw4mbj90uhig6.png"
                alt=""
                className="home-img"
              />
              {/* <img src="/giveneed.png" alt="" className="home-img" /> */}
              <img
                src="https://res.cloudinary.com/dqc2xhnac/image/upload/v1708583150/Med-equip/jadpznv3ybnpnoby4xqd.png"
                alt=""
                className="home-img"
              />
            </div>
            <div className="home-p">
              We Care of Lake County is grateful for all the support and donated
              equipment we've received thus far since our start. Our medical
              equipment charity in Central Florida accepts donations of durable
              medical equipment, which will be used to help needy patients
              recover, rehabilitate, and resume their life with independence.
              Turn to us today to donate durable medical equipment and make a
              difference in the lives of members of the community. If you don't
              have any equipment to donate, please consider a cash donation to
              support We Share's efforts.
            </div>
            {token !== null && role !== null ? (
              <>
                {token !== null && role == 1 ? (
                  <>
                    <Link to={"/admin/new-product"} id="button-arrow">
                      <button id="donate-button">New Arrivals </button>
                    </Link>
                  </>
                ) : (
                  <>
                    {token != null && role == 2 ? (
                      <div className="home-btn-group">
                        <Link to={"/uuidverify"} id="button-arrow">
                          <button id="donate-button">Equipments </button>
                        </Link>
                        OR
                        <Link to={"/user/payment"} id="button-arrow">
                          <button id="donate-button">Money instead? </button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <Link
                          to={"/volunteer/new-product-list"}
                          id="button-arrow"
                        >
                          <button id="donate-button">New Arrivals</button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Link to={"/login"} id="button-arrow">
                  <button id="donate-button">LOGIN HERE </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {(role == null) & (token == null) ? (
          <>
            <div className="home-available-product-head" data-aos="fade-up">
              Available Products
            </div>
            <div className="home-cards-sec">
              {load == true ? (
                <Loader load={load} />
              ) : (
                <>
                  {product.map((item) => (
                    <>
                      <div
                        className="home-card"
                        key={item._id}
                        onClick={cardError}
                        data-aos="fade-up"
                      >
                        <div className="home-card-image">
                          <img
                            src={item.image}
                            alt=""
                            className="user-card-image"
                          />
                        </div>
                        <div className="home-card-details">
                          <h3 className="home-card-details-h3"> {item.name}</h3>
                          <h4 className="home-card-details-h4">
                            {" "}
                            {item.available_qty} Qty
                          </h4>
                          <h4 className="home-card-details-h4">
                            {" "}
                            {item.category}
                          </h4>
                          <h4 className="home-card-details-h4">
                            {" "}
                            {item.sub_category}
                          </h4>
                          <h4 className="home-card-details-h4">
                            {" "}
                            {item.description}
                          </h4>
                        </div>
                      </div>
                    </>
                  ))}
                </>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default HomePage;
