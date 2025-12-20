import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
export default function Blank() {
  return (
    <div>
      <PageMeta title="Dashboard" description="Dashboard" />
      <PageBreadcrumb pageTitle="Dashboard" />

    </div>
  );
}
