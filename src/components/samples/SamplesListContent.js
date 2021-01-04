import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import AppPageHeader from "../AppPageHeader";
import PageContent from "../PageContent";
import PaginatedTable from "../PaginatedTable";
import {SampleDepletion} from "./SampleDepletion";
import ExportButton from "../ExportButton";

import api, {withToken}  from "../../utils/api"

import {list} from "../../modules/samples/actions";
import {actionsToButtonList} from "../../utils/templateActions";
import SamplesFilters from "./SamplesFilters";
import serializeFilterParams from "../../utils/serializeFilterParams";
import {SAMPLE_FILTERS} from "../filters/descriptions";

const mapStateToProps = state => ({
  token: state.auth.tokens.access,
  samplesByID: state.samples.itemsByID,
  samples: state.samples.items,
  containersByID: state.containers.itemsByID,
  actions: state.sampleTemplateActions,
  page: state.samples.page,
  totalCount: state.samples.totalCount,
  isFetching: state.samples.isFetching,
  filters: state.samples.filters,
});

const actionCreators = {list};

const SamplesListContent = ({
  token,
  samples,
  samplesByID,
  containersByID,
  actions,
  isFetching,
  page,
  totalCount,
  list,
  filters,
}) => {
  const TABLE_COLUMNS = [
    {
      title: "Type",
      dataIndex: "biospecimen_type",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (name, sample) => <Link to={`/samples/${sample.id}`}>{name}</Link>,
    },
    {
      title: "Alias",
      dataIndex: "alias",
    },
    {
      title: "Individual",
      dataIndex: "individual",
      render: individual => <Link to={`/individuals/${individual}`}>{individual}</Link>,
    },
    {
      title: "Container",
      dataIndex: "container",
      render: containerID =>
        <Link to={`/containers/${containerID}`}>
          {containersByID[containerID] ?
            containersByID[containerID].name :
            containerID
          }
        </Link>,
    },
    {
      title: "Coords",
      dataIndex: "coordinates",
      width: 70,
    },
    {
      title: "Vol. (µL)",
      dataIndex: "volume_history",
      render: vh => parseFloat(vh[vh.length - 1].volume_value).toFixed(3),
      width: 100,
    },
    {
      title: "Conc. (ng/µL)",
      dataIndex: "concentration",
      render: conc => conc === null ? "—" : parseFloat(conc).toFixed(3),
      width: 115,
    },
    {
      title: "Depleted",
      dataIndex: "depleted",
      render: depleted => <SampleDepletion depleted={depleted} />,
      width: 85,
    }
  ];
  const listExport = () =>
    withToken(token, api.samples.listExport)({...serializeFilterParams(filters, SAMPLE_FILTERS)}).then(response => response.data)

  return <>
    <AppPageHeader title="Samples & Extractions" extra={[
      <ExportButton exportFunction={listExport} filename="samples"/>,
      ...actionsToButtonList("/samples", actions)
    ]}/>
    <PageContent>
      <SamplesFilters />
      <PaginatedTable
        // filters as a key in order to instantiate a new component on filters state change
        key={JSON.stringify(filters)}
        columns={TABLE_COLUMNS}
        items={samples}
        itemsByID={samplesByID}
        rowKey="id"
        loading={isFetching}
        totalCount={totalCount}
        page={page}
        onLoad={list}
      />
    </PageContent>
  </>;
}

export default connect(mapStateToProps, actionCreators)(SamplesListContent);
