import React, { useEffect, useState } from "react";
import { List, Page, Icon, useNavigate, Modal } from "zmp-ui";
import { useRecoilValue } from "recoil";
// import { userState } from "../state";
import { getAccessToken, getUserInfo } from "zmp-sdk/apis";
import { requestCameraPermission } from "zmp-sdk/apis";
import UserCard from "../components/user-card";
import { getPhoneNumber } from "zmp-sdk/apis";
const HomePage: React.FunctionComponent = () => {
  // const user = useRecoilValue(userState);
  // const navigate = useNavigate();
  const [isShowModal, setShowModal] = useState(true);
  const [user, setUser] = useState({
    name: "",
    image: "",
    phone: "",
  });
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      const dataPhone = await getPhoneNumber();
      const accessToken = await getAccessToken();
      console.log("userInfo: ", userInfo);
      console.log("dataPhone: ", dataPhone);
      fetch("https://graph.zalo.me/v2.0/me/info", {
        method: "GET",
        headers: {
          access_token: accessToken,
          code: dataPhone.token as string,
          secret_key: "GfVO48gW6L7jFbBwmrMW",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setUser({
            ...user,
            name: userInfo.name,
            image: userInfo.avatar,
            phone: data.data.number,
          });
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  return (
    // <Page className="page">
    //   <div className="section-container">
    //     <UserCard user={user.userInfo} />
    //   </div>
    //   <div className="section-container">
    //     <List>
    //       <List.Item
    //         onClick={() => navigate("/about")}
    //         suffix={<Icon icon="zi-arrow-right" />}
    //       >
    //         <div>About</div>
    //       </List.Item>
    //       <List.Item
    //         onClick={() => navigate("/user")}
    //         suffix={<Icon icon="zi-arrow-right" />}
    //       >
    //         <div>User</div>
    //       </List.Item>
    //     </List>
    //   </div>
    // </Page>
    <>
      <Modal
        visible={isShowModal}
        title="This is the title"
        onClose={() => {
          setShowModal(false);
        }}
      >
        <p>Tên Name: {user.name}</p>
        <p>SDT: {user.phone}</p>
        <div>
          Hình ảnh đại diện:
          <img src={user.image} alt="" />
        </div>
      </Modal>
    </>
  );
};

export default HomePage;
