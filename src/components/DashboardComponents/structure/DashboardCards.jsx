import { Card, Col, Flex, Row, Typography } from "antd";
import { ModuleTopHeading } from "../../PageComponents";
import { GET_BUSINESS_STATS } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const { Title, Text } = Typography;
const DashboardCards = () => {
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();
  // const { data, error } = useQuery(GET_BUSINESS_STATS);

  // if (error) {
  //   return (
  //     <Card>
  //       <Text type="danger">
  //         {t("Error loading business stats:")} {error.message}
  //       </Text>
  //     </Card>
  //   );
  // }

  // Destructure API response safely
  // const stats = data?.getBusinessStats || {};

  const cardsData = [
    {
      id: 1,
      icon: "dc-1.png",
      title: 0,
      subtitle: "System Status",
    },
    {
      id: 2,
      icon: "dc-2.png",
      title: 0,
      subtitle: "Active VINs",
    },
    {
      id: 3,
      icon: "dc-3.png",
      title: 0,
      subtitle: "Pending Blockchain Transactions",
    },
    {
      id: 4,
      icon: "dc-4.png",
      title: 0,
      subtitle: "Alerts",
    },
  ];

  return (
    <>
      <Card className="main-card-color radius-12">
        <Row gutter={[14, 14]}>
          <Col span={24}>
            <ModuleTopHeading level={4} name={t("Reservation Statistics")} />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <Row gutter={[14, 24]} className="h-100">
              {cardsData?.map((item, index) => (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                  key={index}
                >
                  <Card className={`shadow-d radius-12 h-100 border-gray`} style={{backgroundColor: '#202452'}}>
                    <Flex gap={8} vertical>
                      <div>
                        <img
                          src={"/assets/icons/" + item?.icon}
                          width={45}
                          alt="stats icon"
                          fetchPriority="high"
                        />
                      </div>
                      <Text className="fs-14 text-white">
                        {t(item?.subtitle)}
                      </Text>
                      <Title level={5} className="fw-600 text-white m-0">
                        {item?.title}
                      </Title>
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          {/* <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 5 }}
          >
            <Card className={`shadow-d radius-12 h-100 border-gray`}>
              <Flex gap={8} vertical>
                <div>
                  <img
                    src={"/assets/icons/dc-5.png"}
                    width={45}
                    alt="icon"
                    fetchPriority="high"
                  />
                </div>
                <Text className="fs-14 text-gray">{t("")}</Text>
                <Title level={5} className="fw-600 text-black m-0">
                  {stats.todaysMeetings || 0}
                </Title>
              </Flex>
            </Card>
          </Col> */}
        </Row>
      </Card>
    </>
  );
};

export { DashboardCards };
