import React, { useState } from "react";
import Filters from "./Filter";
import TableView from "./TableView";
import Loader from "./Loader";
import "./trainingReport.css";
import TrainingReportManager from "./Filter";

import api from "../../../api/axios";


const TrainingReport = () => {

    return (
        <div className="container">
            <TrainingReportManager />
        </div>
    );
};

export default TrainingReport;