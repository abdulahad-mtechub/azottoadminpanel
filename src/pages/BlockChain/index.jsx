import { Row, Col, Card } from "antd";
import { BlockChainTable,  ModuleTopHeading } from "../../components";
import { t } from "i18next";

const BlockChain = () => {
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <ModuleTopHeading level={4} name={t("Blockchain")} />
        </Col>
        
        <Col span={24}>
          <Card className="radius-12 border-gray main-card-color">
          <BlockChainTable />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export { BlockChain };
