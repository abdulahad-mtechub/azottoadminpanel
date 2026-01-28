import { Row, Col, Flex } from "antd";
import {
  VinListingTable,
  ModuleTopHeading,
} from "../../components";
import { GET_BUSINESSES } from "../../graphql/query/business";
import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const VinManagementPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({});

  const [loadBusinesses, { data, loading }] = useLazyQuery(GET_BUSINESSES, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBusinesses({
        variables: {
          limit: pageSize,
          offSet: (page - 1) * pageSize,
          search: search || null,
          filter: {
            ...filters,
            categoryId: category || null,
            businessStatus: status || null,
          },
        },
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [page, pageSize, search, status, category, filters, loadBusinesses]);

  const totalCount = data?.getAdminBusinesses?.totalCount;

  const handleFiltersChange = (filters) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      ...filters,
    }));
  };

  const handlePageChange = (page, size) => {
    setPage(page);
    setPageSize(size);
  };

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={t("Vin Management")} />
          </Flex>
        </Col>
        <Col span={24}>
          <VinListingTable
            businesses={data?.getAdminBusinesses?.businesses || []}
            totalCount={totalCount}
            loading={loading}
            page={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onFiltersChange={handleFiltersChange}
            search={search}
            setSearch={(val) => {
              setPage(1);
              const searchValue = val?.target?.value ?? val;
              setSearch(searchValue);
            }}
            category={category}
            setCategory={(val) => {
              setPage(1);
              setCategory(val);
            }}
            setStatus={(val) => {
              setPage(1);
              setStatus(val);
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export { VinManagementPage };
