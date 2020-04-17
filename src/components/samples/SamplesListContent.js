import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import {Button, Table} from "antd";
import "antd/es/button/style/css";
import "antd/es/table/style/css";
import {EditOutlined, ExperimentFilled, ExperimentOutlined, PlusOutlined} from "@ant-design/icons";

import AppPageHeader from "../AppPageHeader";
import PageContent from "../PageContent";

const TABLE_COLUMNS = [
    {
        title: "Type",
        dataIndex: "biospecimen_type",
        width: 80,
        filters: [
            {text: "DNA", value: "DNA"},
            {text: "RNA", value: "RNA"},
            {text: "Blood", value: "BLOOD"},
            {text: "Saliva", value: "SALIVA"},
        ],
        onFilter: (value, record) => record.biospecimen_type === value,
    },
    {
        title: "Name",
        dataIndex: "name",
        render: name => <a href="#">{name}</a>,  // TODO: Nice sample display
    },
    {
        title: "Alias",
        dataIndex: "alias",
    },
    {
        title: "Individual",
        dataIndex: "individual",
        render: individual => <a href="#">{individual}</a>,  // TODO
    },
    {
        title: "Container",
        dataIndex: "container",
        render: container => <a href="#">{container}</a>,  // TODO
    },
    {
        title: "Coords",
        dataIndex: "coordinates",
        width: 70,
    },
    {
        title: "Vol. (µL)",
        dataIndex: "volume_history",
        render: vh => vh[vh.length - 1].volume_value,
        width: 100,
    },
    {
        title: "Conc. (ng/µL)",
        dataIndex: "concentration",
        width: 115,
    },
    {
        title: "Depleted",
        dataIndex: "depleted",
        render: depleted => depleted
            ? <span style={{color: "#f5222d"}}><ExperimentOutlined style={{marginRight: "8px"}} />Yes</span>
            : <span style={{color: "#a0d911"}}><ExperimentFilled style={{marginRight: "8px"}} />No</span>,
        width: 85,
    }
];

const SamplesListContent = ({samples, isFetching}) => <>
    <AppPageHeader title="Samples & Extractions"
                   extra={[
                       <Link key="add" to="/samples/add">
                           <Button icon={<PlusOutlined />}>Add Samples</Button>
                       </Link>,
                       <Link key="update" to="/samples/update">
                           <Button icon={<EditOutlined />}>Update Samples</Button>
                       </Link>,
                       <Link key="process" to="/samples/extract">
                           <Button icon={<ExperimentOutlined />}>Process Extractions</Button>
                       </Link>,
                   ]} />
    <PageContent>
        <Table size="small"
               bordered={true}
               columns={TABLE_COLUMNS}
               dataSource={samples}
               rowKey="id"
               loading={isFetching} />
    </PageContent>
</>;

const mapStateToProps = state => ({
    samples: state.samples.items,
    isFetching: state.samples.isFetching,
});

export default connect(mapStateToProps)(SamplesListContent);
