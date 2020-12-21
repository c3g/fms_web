import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, useHistory, useParams} from "react-router-dom";

import {Descriptions, Space, Spin} from "antd";
import "antd/es/descriptions/style/css";
import "antd/es/space/style/css";
import "antd/es/spin/style/css";

import AppPageHeader from "../AppPageHeader";
import PageContent from "../PageContent";
import { get } from "../../modules/individuals/actions";
import withNestedField from "../../utils/withNestedField"

const IndividualsDetailContent = ({individualsByID, get}) => {
    const history = useHistory();
    const {id} = useParams();
    const isLoaded = id in individualsByID;
    const individual = individualsByID[id] || {};

    if (!isLoaded)
        get(id);

    const isLoading = !isLoaded || individual.isFetching;
    const title = individual.label;

    return <>
        <AppPageHeader title={title} onBack={history.goBack} />
        <PageContent loading={isLoading}>
            <Descriptions bordered={true} size="small">
                <Descriptions.Item label="Name">{individual.label}</Descriptions.Item>
                <Descriptions.Item label="Taxon"><em>{individual.taxon}</em></Descriptions.Item>
                <Descriptions.Item label="Sex">{individual.sex}</Descriptions.Item>
                <Descriptions.Item label="Pedigree">{individual.pedigree}</Descriptions.Item>
                <Descriptions.Item label="Cohort" span={2}>{individual.cohort}</Descriptions.Item>
                <Descriptions.Item label="Mother">
                    {individual.mother ?
                        (
                        <Link to={`/individuals/${individual.mother}`}>
                            {withNestedField(get, "label", individualsByID, individual.mother, "Loading...")}
                        </Link>
                        ) :
                        "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Father">
                    {individual.father ?
                        (
                        <Link to={`/individuals/${individual.father}`}>
                            {withNestedField(get, "label", individualsByID, individual.father, "Loading...")}
                        </Link>
                        ) :
                        "—"}
                </Descriptions.Item>
            </Descriptions>
        </PageContent>
    </>;
};

const mapStateToProps = state => ({
    individualsByID: state.individuals.itemsByID,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ get }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IndividualsDetailContent);
