import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import {BarcodeOutlined} from "@ant-design/icons";

import AppPageHeader from "../AppPageHeader";
import PageContent from "../PageContent";
import PaginatedTable from "../PaginatedTable";

import {list, listTemplateActions} from "../../modules/containers/actions";
import {actionsToButtonList} from "../../utils/templateActions";

const TABLE_COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: <><BarcodeOutlined style={{marginRight: "8px"}} /> Barcode</>,
    dataIndex: "barcode",
    render: (barcode, container) => <Link to={`/containers/${container.id}`}>{barcode}</Link>,
  },
  {
    title: "Sample",
    dataIndex: "samples",
    render: (samples, container) =>
      (container.kind == "tube" && samples.length > 0) ? 
        <Link to={`/samples/${samples[0].id}`}>{samples[0].name}</Link> : 
        null,
  },
  {
    title: "Kind",
    dataIndex: "kind",
  },
  {
    title: "Location Name",
    dataIndex: "location",
    render: location => location ? <>{location.name}</> : null,
  },
  {
    title: <><BarcodeOutlined style={{marginRight: "8px"}} /> Location Barcode</>,
    dataIndex: "location",
    render: location => location ? <Link to={`/containers/${location.id}`}>{location.barcode}</Link> : null,
  },
];

const mapStateToProps = state => ({
  containersByID: state.containers.itemsByID,
  containers: state.containers.items,
  actions: state.containerTemplateActions,
  page: state.containers.page,
  totalCount: state.containers.totalCount,
  isFetching: state.containers.isFetching,
});

const actionCreators = {list, listTemplateActions};

const ContainersListContent = ({
  containers,
  containersByID,
  actions,
  isFetching,
  page,
  totalCount,
  list,
  listTemplateActions,
}) => {
  useEffect(() => {
    // Must be wrapped; effects cannot return promises
    listTemplateActions();
  }, []);
  return <>
    <AppPageHeader title="Containers" extra={actionsToButtonList("/containers", actions)} />
    <PageContent>
      <PaginatedTable
        columns={TABLE_COLUMNS}
        items={containers}
        itemsByID={containersByID}
        loading={isFetching}
        totalCount={totalCount}
        page={page}
        onLoad={list}
      />
    </PageContent>
  </>;
}

export default connect(mapStateToProps, actionCreators)(ContainersListContent);
