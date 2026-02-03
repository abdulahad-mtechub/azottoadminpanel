import {
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
  Form,
  Row,
  Table,
  Typography,
  message,
} from "antd";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { CustomPagination, DeleteModal, TableLoader } from "../../Ui";
import { MySelect, SearchInput } from "../../Forms";
import { ViewIdentity } from "../modals";
import { UPDATE_USER, DELETE_USER } from "../../../graphql/mutation";
import { USERS } from "../../../graphql/query/user";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useCities } from "../../../shared";

const { Text } = Typography;
const UserManagementTable = ({ setVisible, setEditItem }) => {
  const [form] = Form.useForm();
  const cities = useCities();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [viewmodal, setViewModal] = useState(false);
  const [viewstate, SetViewState] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [loadUsers, { data, loading }] = useLazyQuery(USERS, {
    fetchPolicy: "network-only",
  });

  const filter = useMemo(() => {
    return {
      city: selectedCity || null,
      district: selectedDistrict || null,
      status: selectedStatus || null,
      name: searchValue || null,
      createdType: selectedCategory || null,
    };
  }, [
    selectedCity,
    selectedDistrict,
    selectedStatus,
    selectedCategory,
    searchValue,
  ]);

  useEffect(() => {
    loadUsers({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        filter,
      },
    });
  }, [pageSize, current, filter, loadUsers]);

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      loadUsers({
        variables: {
          limit: pageSize,
          offset: (current - 1) * pageSize,
          filter,
        },
      });
    },
  });

  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      messageApi.success("User deleted successfully!");
      loadUsers({
        variables: {
          limit: pageSize,
          offset: (current - 1) * pageSize,
          filter,
        },
      });
    },
    onError: (err) => {
      messageApi.error(err.message || "Something went wrong!");
    },
  });

  const usermanageColumn = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Wallet Address",
      dataIndex: "walletAddress",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, row) => {
        const handleStatusChange = async () => {
          try {
            await updateUser({
              variables: {
                input: {
                  id: row.key,
                  status: row.status === "verified" ? "inactive" : "verified",
                },
              },
            });
            messageApi.success("User status updated successfully!");
          } catch (err) {
            messageApi.error(err.message || "Something went wrong!");
          }
        };
        return (
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        setVisible(true);
                        setEditItem(row);
                      }}
                    >
                      Edit
                    </NavLink>
                  ),
                  key: "1",
                },
                ...(row.status === "verified"
                  ? [
                      {
                        label: (
                          <NavLink
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusChange(row);
                            }}
                          >
                            Inactive
                          </NavLink>
                        ),
                        key: "2",
                      },
                    ]
                  : [
                      {
                        label: (
                          <NavLink
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusChange(row);
                            }}
                          >
                            Verify
                          </NavLink>
                        ),
                        key: "2",
                      },
                    ]),
                {
                  label: (
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedUserId(row.key);
                        setDeleteVisible(true);
                      }}
                    >
                      Delete
                    </NavLink>
                  ),
                  key: "3",
                },
                {
                  label: (
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        setViewModal(true);
                        SetViewState(row);
                      }}
                    >
                      View Passport & National ID
                    </NavLink>
                  ),
                  key: "4",
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button
              aria-labelledby="action button"
              className="bg-transparent border0 p-0"
            >
              <img
                src="/assets/icons/dots.png"
                alt="dot icon"
                width={16}
                fetchPriority="high"
              />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleDistrictClick = (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedCity(null); // Reset city when district changes
    setCurrent(1);
    setPageSize(10);
  };

  const handleCityClick = (cityId) => {
    setSelectedCity(cityId);
    setCurrent(1);
    setPageSize(10);
  };

  const handleTypeChange = (value) => {
    setSelectedCategory(value);
    setCurrent(1);
    setPageSize(10);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrent(1);
    setPageSize(10);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchValue(searchTerm.trim());
      setCurrent(1);
      setPageSize(10);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Get available cities for selected district
  const availableCities = useMemo(() => {
    if (!selectedDistrict) return [];
    return cities[selectedDistrict] || [];
  }, [selectedDistrict, cities]);

  // ----------------- Data Mapping -----------------
  const usermanageData =
    data?.getUsers?.users?.map((user) => ({
      key: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      district: user.district,
      city: user.city,
      mobileno: user.phone,
      type: user.type,
      status: user.status,
      documents: user.documents,
    })) || [];

  const total = data?.getUsers?.totalCount;

  const typeItems = [
    { id: "new", name: "New" },
    { id: "old", name: "Old" },
  ];

  const statusItems = [
    { id: "verified", name: "Active" },
    { id: "inactive", name: "Inactive" },
    { id: "pending", name: "Pending" },
  ];

  return (
    <>
      {contextHolder}
      <Card className="radius-12 border-gray main-card-color">
        <Flex vertical gap={20}>
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Flex gap={5} wrap>
                  <SearchInput
                    withoutForm
                    name="name"
                    placeholder="Search"
                    prefix={
                      <img
                        src="/assets/icons/search.png"
                        width={14}
                        alt="search icon"
                        fetchPriority="high"
                      />
                    }
                    allowClear
                    className="border-light-gray pad-x ps-0 radius-8 fs-13"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {/* <MySelect
                    withoutForm
                    options={districts}
                    onChange={handleDistrictClick}
                    placeholder={t("Region")}
                    allowClear
                    showKey
                  />
                  <MySelect
                    withoutForm
                    options={availableCities}
                    onChange={handleCityClick}
                    placeholder={t("City")}
                    allowClear
                    showKey
                    disabled={!selectedDistrict}
                  /> */}
                  <MySelect
                    withoutForm
                    options={typeItems}
                    onChange={handleTypeChange}
                    placeholder="Role"
                    allowClear
                    showKey
                  />
                  <MySelect
                    withoutForm
                    options={statusItems}
                    onChange={handleStatusChange}
                    placeholder="Status"
                    allowClear
                    showKey
                  />
                </Flex>
              </Col>
            </Row>
          </Form>
          <Table
            size="large"
            columns={usermanageColumn}
            dataSource={usermanageData}
            className="pagination table-cs table"
            showSorterTooltip={false}
            scroll={{ x: 1000 }}
            rowHoverable={false}
            pagination={false}
            loading={{
              ...TableLoader,
              spinning: loading || updating,
            }}
          />
          <CustomPagination
            total={total}
            current={current}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </Flex>
      </Card>

      <ViewIdentity
        visible={viewmodal}
        viewstate={viewstate}
        onClose={() => {
          setViewModal(false);
          SetViewState(null);
        }}
      />

      <DeleteModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        title="Are you sure?"
        subtitle="This action cannot be undone. Are you sure you want to delete this user?"
        type="danger"
        loading={deleting}
        onConfirm={async () => {
          try {
            await deleteUser({ variables: { deleteUserId: selectedUserId } });
            setDeleteVisible(false);
            setSelectedUserId(null);
          } catch {
            // message handled in onError
          }
        }}
      />
    </>
  );
};

export { UserManagementTable };
