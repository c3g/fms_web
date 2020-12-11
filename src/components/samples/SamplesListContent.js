import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import AppPageHeader from "../AppPageHeader";
import PageContent from "../PageContent";
import PaginatedTable from "../PaginatedTable";
import {SampleDepletion} from "./SampleDepletion";

import {list, listTemplateActions} from "../../modules/samples/actions";
import {get as getIndividual} from "../../modules/individuals/actions";
import {get as getContainer} from "../../modules/containers/actions";
import {actionsToButtonList} from "../../utils/templateActions";
import withNestedField from "../../utils/withNestedField";

const mapStateToProps = state => ({
  samplesByID: state.samples.itemsByID,
  samples: state.samples.items,
  containersByID: state.containers.itemsByID,
  individualsByID: state.individuals.itemsByID,
  actions: state.sampleTemplateActions,
  page: state.samples.page,
  totalCount: state.samples.totalCount,
  isFetching: state.samples.isFetching,
});

const actionCreators = {list, listTemplateActions, getIndividual, getContainer};

const SamplesListContent = ({
  samples,
  samplesByID,
  containersByID,
  individualsByID,
  actions,
  isFetching,
  page,
  totalCount,
  list,
  listTemplateActions,
  getIndividual,
  getContainer,
}) => {
  useEffect(() => {
    // Must be wrapped; effects cannot return promises
    listTemplateActions();
  }, []);

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
      render: individual =>
        individual ?
          <Link to={`/individuals/${individual}`}>
            {withNestedField(getIndividual, "label", individualsByID, individual, "loading...")}
          </Link> :
          null,
    },
    {
      title: "Container Name",
      dataIndex: "container",
      render: container => container ? withNestedField(getContainer, "name", containersByID, container, "loading...") : null,
    },
    {
      title: "Container Barcode",
      dataIndex: "container",
      render: container =>
        container ?
          <Link to={`/containers/${container}`}>
            {withNestedField(getContainer, "barcode", containersByID, container, "loading...")}
          </Link> :
          null,
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


  return <>
    <AppPageHeader title="Samples & Extractions" extra={actionsToButtonList("/samples", actions)} />
    <PageContent>
      <PaginatedTable
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
