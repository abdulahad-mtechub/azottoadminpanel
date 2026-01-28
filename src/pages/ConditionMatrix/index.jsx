import { Row, Col, Flex, Button } from "antd";
import { ModuleTopHeading, ConditionMatrixTable } from "../../components";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ConditionMatrix = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={t("Condition Matrix")} />
          </Flex>
        </Col>
        <Col span={24}>
          <ConditionMatrixTable />
        </Col>
      </Row>
    </>
  );
};

export { ConditionMatrix };
