import React, { useState } from "react";
import Filters from "./Filter";
import TableView from "./TableView";
import Loader from "./Loader";
import "./TrainingReport.css";
import TrainingReportManager from "./Filter";
import Header from "../layout/header";
import Footer from "../layout/footer";
import api from "../../../api/axios";
import TmsLeftNav from "../layout/tms_LeftNav";

const TrainingReport = () => {
    const [navCollapsed, setNavCollapsed] = useState(false);

    return (
        <div className="app-shell">
            <Header />

            <div className="content-area">
                <TmsLeftNav
                    collapsed={navCollapsed}
                    onToggle={() => setNavCollapsed((v) => !v)}
                />

                <div className="main-area">
                    <div style={{ padding: 18 }}>
                        <TrainingReportManager />
                    </div>

                    <Footer />
                </div>
            </div>
            <style>{`.content-area {
  display: flex;
  flex: 1;              /*  pushes footer down */
  min-width: 0;         /*  prevents overflow bug */
}
  .main-area {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* ye sabse important hai */
.main-area > div:first-child {
  flex: 1;
}
`}</style>
        </div>
    );
};

export default TrainingReport;