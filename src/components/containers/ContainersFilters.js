import React from "react";
import {connect} from "react-redux";
import {list, setFilter} from "../../modules/containers/actions";
import FilterSelect from "../filters/FilterSelect";


const mapStateToProps = state => ({
  containersKinds: state.containerKinds.items,
  filters: state.containers.filters,
});

const actionCreators = {setFilter, list};

const ContainersFilters = ({
  containersKinds,
  filters,
  setFilter,
  list,
}) => {

  const onChangeFilter = (name, serializedValue) => {
    setFilter(name, serializedValue)
    list()
  }

  return <>
    <FilterSelect
      filterType="kind__in"
      filterTypeName="kind"
      options={containersKinds.map(x => x.id)}
      mode="multiple"
      placeholder="All"
      onChange={onChangeFilter}
      filters={filters}
    />
  </>;
}

export default connect(mapStateToProps, actionCreators)(ContainersFilters);