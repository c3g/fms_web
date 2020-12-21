import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {BarcodeOutlined} from "@ant-design/icons";

import AppPageHeader from "../AppPageHeader";
import PageContent from "../PageContent";
import PaginatedTable from "../PaginatedTable";
import ExportButton from "../ExportButton";

import {list} from "../../modules/containers/actions";
import api, {withToken}  from "../../utils/api"
import {actionsToButtonList} from "../../utils/templateActions";
import {withContainer, withSample} from "../../utils/withItem";

const CONTAINER_KIND_SHOW_SAMPLE = ["tube"]

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
      (CONTAINER_KIND_SHOW_SAMPLE.includes(container.kind) && samples.length > 0 && 
        <>
          {samples.map((id, i) =>
            <React.Fragment key={id}>
              <Link to={`/samples/${id}`}>
                {withSample(id, sample => sample.name, <small>Loading...</small>)}
              </Link>
              {i !== samples.length - 1 ? ', ' : ''}
            </React.Fragment>
          )}
        </>
        ),
  },
  {
    title: "Kind",
    dataIndex: "kind",
  },
  {
    title: "Location Name",
    dataIndex: "location",
    render: location => (location && withContainer(location, container => container.name, "Loading...")),
  },
  {
    title: <><BarcodeOutlined style={{marginRight: "8px"}} /> Location Barcode</>,
    dataIndex: "location",
    render: location => (location &&
      <Link to={`/containers/${location}`}>
        {withContainer(location, container => container.barcode, "Loading...")}
      </Link>),
  },
];


const mapStateToProps = state => ({
  token: state.auth.tokens.access,
  containersByID: state.containers.itemsByID,
  containers: state.containers.items,
  actions: state.containerTemplateActions,
  page: state.containers.page,
  totalCount: state.containers.totalCount,
  isFetching: state.containers.isFetching,
  samplesByID: state.samples.itemsByID,
});

const actionCreators = {list};

const ContainersListContent = ({
  token,
  containers,
  containersByID,
  actions,
  isFetching,
  page,
  totalCount,
  list,
}) => {

  const listExport = () =>
    withToken(token, api.containers.listExport)().then(response => response.data)

  return <>
    <AppPageHeader title="Containers" extra={[
      <ExportButton exportFunction={listExport} filename="containers"/>,
      ...actionsToButtonList("/containers", actions)
    ]}/>
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
