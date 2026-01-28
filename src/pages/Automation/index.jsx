import { Row, Col, Card } from "antd";
import { Automationable, ModuleTopHeading } from "../../components";
import { t } from "i18next";

const Automation = () => {
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <ModuleTopHeading level={4} name={t("Automation")} />
        </Col>
        <Col span={24}>
          <Card className="radius-12 border-gray main-card-color">
              <Automationable />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export { Automation };
