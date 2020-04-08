import React from "react";

import {Table} from "antd";
import "antd/es/table/style/css";

import AppPageHeader from "./AppPageHeader";
import PageContainer from "./PageContainer";

const TABLE_COLUMNS = [
    {
        title: "ID",
        dataIndex: "participant_id"
    },
    {
        title: "Name",
        dataIndex: "name"
    },
    {
        title: "Taxon",
        dataIndex: "taxon"
    },
    {
        title: "Sex",
        dataIndex: "sex"
    },
    {
        title: "Pedigree",
        dataIndex: "pedigree"  // TODO: Link to modal with optional pedigree ID, mother, father
    },
    {
        title: "Cohort",
        dataIndex: "cohort"
    }
];

const IndividualsPage = () => <PageContainer>
    <AppPageHeader title="Individuals" />
    <div style={{padding: "16px 24px 8px 24px", overflowX: "auto"}}>
        <Table size="small" bordered={true} columns={TABLE_COLUMNS} />
    </div>
</PageContainer>;

export default IndividualsPage;
