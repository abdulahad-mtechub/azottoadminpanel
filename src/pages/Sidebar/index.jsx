import { useState, useEffect, useMemo } from "react";
import { useNavigate, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./index.css";
import { Layout, Menu, Image, Space, Divider } from "antd";
import { Notifications, UserDropdown } from "../../components/Header";
import { VinManagementPage } from "../VinManagementPage";
import {
  SingleviewVinList,
} from "../../components";
import { DocumentInvoicePage } from "../DocumentInvoicePage";
import { UserManagement } from "../UserManagement";
import { BlockChain } from "../BlockChain";
import { Automation } from "../Automation";
import { ConditionMatrix } from "../ConditionMatrix";
import { AuditLogsPage } from "../AuditLogsPage";
import { Alerts } from "../Alerts";
import { SettingsPage } from "../SettingsPage";
import { Dashboard } from "../Dashboard";

const { Header, Sider, Content } = Layout;
const Sidebar = () => {
  let navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState("1");
  const [openKeys, setOpenKeys] = useState([""]);
  const [completedeal, setCompleteDeal] = useState(null);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(storedLang);
    document.documentElement.setAttribute(
      "dir",
      storedLang === "ar" ? "rtl" : "ltr"
    );
    i18n.on("languageChanged", (lng) => {
      document.documentElement.setAttribute(
        "dir",
        lng === "ar" ? "rtl" : "ltr"
      );
      localStorage.setItem("lang", lng);
    });
    return () => {
      i18n.off("languageChanged");
    };
  }, [i18n]);

  function getItem(label, key, icon, children) {
    return { key, icon, children, label };
  }

  useEffect(() => {
    const tab = location.pathname.split("/")[1];
  
    const tabMap = {
      "": "1",
      dashboard: "1",
  
      vinmanagement: "2",
      businesslist: "2",
      businesslisting: "2",
      createbusinesslist: "2",
  
      docinvoice: "3",
  
      usermanagement: "4",
  
      blockchain: "5",
  
      automation: "6",
      conditionmatrix: "7",
  
      auditlogs: "8",
  
      alertpage: "9",
      notifications: "9",
      pushnotificationmanager: "9",
      notificationdetails: "9",
  
      settings: "10",
    };
  
    setCurrentTab(tabMap[tab] || "1");
  }, [location.pathname]);
  
  

  const menuItems = useMemo(
    () => [
      getItem(t("Dashboard"), "1"),
      getItem(t("VIN Management"), "2"),
      getItem(t("Documents & Invoices"), "3"),
      getItem(t("User Management"), "4"),
      getItem(t("Blockchain"), "5"),
      getItem(t("Automation"), "6"),
      getItem(t("Condition Matrix"), "7"),
      getItem(t("Audit Logs"), "8"),
      getItem(t("Notifications"), "9"),
      getItem(t("System Control"), "10"),
    ],
    [i18n.language]
  );

  const handleMenuClick = (e) => {
    const { key } = e;
    switch (key) {
      case "1":
        navigate("/", { replace: true });
        break;
      case "2":
        navigate("/vinmanagement", { replace: true });
        break;
      case "3":
        navigate("/docinvoice", { replace: true });
        break;
      case "4":
        navigate("/usermanagement", { replace: true });
        break;
      case "5":
        navigate("/blockchain", { replace: true });
        break;
      case "6":
        navigate("/automation", { replace: true });
        break;
      case "7":
        navigate("/conditionmatrix", { replace: true });
        break;
      case "8":
        navigate("/auditlogs", { replace: true });
        break;
      case "9":
        navigate("/alertpage", { replace: true });
        break;
      case "10":
        navigate("/settings", { replace: true });
        break;
      default:
        break;
    }
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
    // localStorage.setItem('openKeys', JSON.stringify(keys));
  };
  return (
    <Layout className="h-100vh">
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`h-100vh overflow-y border-right-side scroll-bar ${
          collapsed ? "addclass overflowstyle" : "overflowstyle"
        }`}
      >
        <div className="logo justify-center">
          <Image
            width={collapsed ? "100%" : 130}
            height={"auto"}
            src="/assets/images/logo.svg"
            alt="Azotto logo"
            preview={false}
            fetchPriority="high"
            className="m-0"
          />
        </div>
        <Menu
          defaultSelectedKeys={["1"]}
          selectedKeys={[currentTab]}
          mode="inline"
          theme="dark"
          onClick={handleMenuClick}
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          items={menuItems}
          className="listitem"
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background header-mbl-cs justify-center p-0">
          <div className="header-cs-structure">
            <div onClick={() => setCollapsed(!collapsed)}>
              <Image
                src="/assets/icons/collapse.webp"
                width={"35px"}
                preview={false}
                style={{
                  transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                }}
                alt="collapse-icon"
                fetchPriority="high"
              />
            </div>
            <Space size={30} align="center">
              <Notifications />
              <UserDropdown />
            </Space>
          </div>
        </Header>
        <Divider className="border-gray mt-0" />
        <Content className="scroll-bar structure-content-area-cs">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vinmanagement" element={<VinManagementPage />} />
            <Route path="/vinmanagement/details/:id" element={<SingleviewVinList />}/>
            <Route path="/docinvoice"  element={<DocumentInvoicePage />}/>
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/blockchain" element={<BlockChain />} />
            <Route path="/automation" element={<Automation setCompleteDeal={setCompleteDeal} />} />
            <Route path="/auditlogs" element={<AuditLogsPage />} />
            <Route path="/alertpage" element={<Alerts />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/conditionmatrix" element={<ConditionMatrix />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export { Sidebar };
