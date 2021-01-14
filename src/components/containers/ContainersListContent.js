import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Button} from "antd";

import AppPageHeader from "../AppPageHeader";
import PageContent from "../PageContent";
import PaginatedTable from "../PaginatedTable";
import AddButton from "../AddButton";
import ExportButton from "../ExportButton";


import {list, setFilter, clearFilters, setSortBy} from "../../modules/containers/actions";
import api, {withToken}  from "../../utils/api"
import {actionsToButtonList} from "../../utils/templateActions";
import {withContainer, withSample} from "../../utils/withItem";
import serializeFilterParams from "../../utils/serializeFilterParams";

import {CONTAINER_FILTERS} from "../filters/descriptions";
import getFilterProps from "../filters/getFilterProps";
import FiltersWarning from "../filters/FiltersWarning";

const CONTAINER_KIND_SHOW_SAMPLE = ["tube"]

const getTableColumns = (samplesByID, containersByID, containerKinds) => [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      sorter: true,
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
                  {withSample(samplesByID, id, sample => sample.name, <span>Loading…</span>)}
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
      sorter: true,
      options: containerKinds.map(kind => ({
        value: kind.id,
        label: kind.id,
      })), // for getFilterProps
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: true,
      render: location => (location &&
        <Link to={`/containers/${location}`}>
          {withContainer(containersByID, location, container => container.name, "Loading...")}
        </Link>),
    },
    {
      title: "Children",
      dataIndex: "children",
      align: 'right',
      sorter: true,
      render: children => children ? children.length : null,
    },
    {
      title: "Coord.",
      dataIndex: "coordinates",
      sorter: true,
    },
  ];


const mapStateToProps = state => ({
  token: state.auth.tokens.access,
  containersByID: state.containers.itemsByID,
  containers: state.containers.items,
  containerKinds: state.containerKinds.items,
  sortBy: state.containers.sortBy,
  filters: state.containers.filters,
  actions: state.containerTemplateActions,
  page: state.containers.page,
  totalCount: state.containers.totalCount,
  isFetching: state.containers.isFetching,
  samplesByID: state.samples.itemsByID,
});

const actionCreators = {list, setFilter, clearFilters, setSortBy};

const ContainersListContent = ({
  token,
  containers,
  containersByID,
  containerKinds,
  samplesByID,
  sortBy,
  filters,
  actions,
  isFetching,
  page,
  totalCount,
  list,
  setFilter,
  clearFilters,
  setSortBy,
}) => {
  const listExport = () =>
    withToken(token, api.containers.listExport)
      (serializeFilterParams(filters, CONTAINER_FILTERS))
      .then(response => response.data)

  const columns = getTableColumns(samplesByID, containersByID, containerKinds)
    .map(c => Object.assign(c, getFilterProps(
      c,
      CONTAINER_FILTERS,
      filters,
      setFilter,
    )))

  const nFilters = Object.entries(filters).filter(e => e[1]).length

  return <>
    <AppPageHeader title="Containers" extra={[
      <AddButton key='add' url="/containers/add" />,
      ...actionsToButtonList("/containers", actions),
      <ExportButton key='export' exportFunction={listExport} filename="containers"/>,
    ]}/>
    <PageContent>
      <div style={{ textAlign: 'right', marginBottom: '1em' }}>
        <FiltersWarning value={nFilters} />
        <Button
          disabled={nFilters === 0}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
      <PaginatedTable
        columns={columns}
        items={containers}
        itemsByID={containersByID}
        loading={isFetching}
        totalCount={totalCount}
        page={page}
        filters={filters}
        sortBy={sortBy}
        onLoad={list}
        onChangeSort={setSortBy}
      />
    </PageContent>
  </>;
}

export default connect(mapStateToProps, actionCreators)(ContainersListContent);
