import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Datetime from "react-datetime";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Card from "../Card/Card"
import MiniTableButton from "../MiniTableButton/MiniTableButton"
import { get_all_courier } from "../../api/api"
import Items from "../Modals/SearchBarCode";
const Sale = (props) => {
    const [update, setUpdate] = useState(false)
    const [items, setItems] = useState(false)
    const [dataDB, setDataDB] = useState([]);
    const [metaData, setMetaData] = useState({})
    const [itemsData, setItemsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState('')
    const [time, setTime] = useState({ time: new Date().toISOString() });
    const [courierItems, setCourierItems] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        get();
    }, []);
    useEffect(() => {
        get();
    }, [time]);
    const get = (state) => {
        setLoading(true)
        let newParams = {
            page: state ? state.page + 1 : 1,
            limit: state ? state.pageSize : 10,
            date: time.time,
            // name: '',
            // barcode: '',
            // orderNo: ''
        }
        // if (state) {
        //     state.filtered.forEach(element => {
        //         newParams[element.id] = element.value
        //     })
        // }
        get_all_courier(newParams).then(res => {
            if (res.error) { } else {
                setDataDB(res.data)
                // setMetaData(res.data.metadata)
                // console.log(res.data.data)
                setLoading(false)
            }
        })
    }   
    let data = dataDB ?
        dataDB.map((element, index) => {
            return {
                name: element.uid.name,
                vNo: element.uid.vehical_no,
                status: element.return ? "Completed" : "Pending",
                action: <MiniTableButton text={<i className="fa fa-eye" aria-hidden="true"></i>} handleClick={() => {
                    setCourierItems(element.sendItems)
                    setItems(true)
                }} />,
                cashInHand: element.grandTotal,
                commission: element.commissionedAmount?element.commissionedAmount:"Basic Pay"
            }
        })

        : []
    const columns = [
        {
            Header: "Name",
            accessor: "name",
            sortable: false,
            filterable: false,

        },

        {
            Header: "Vehicle No",
            accessor: "vNo",
            sortable: false,
            filterable: false
        }, {
            Header: "Cash In Hand",
            accessor: "cashInHand",
            sortable: false,
            filterable: false
        },
        {
            Header: "Commission",
            accessor: "commission",
            sortable: false,
            filterable: false
        },

        {
            Header: "Status",
            accessor: "status",
            sortable: false,
            filterable: false
        },
        {
            Header: "Action",
            accessor: "action",
            sortable: false,
            filterable: false
        },




    ]
    return (<div>
        <Items data={courierItems} show={items} handleClose={() => setItems(false)} />
        <Row>
            <Col md="1"></Col>
            <Col md="10">
                <Card
                    content={
                        <Datetime
                            inputProps={{ placeholder: "Datetime Picker Here" }}
                            defaultValue={new Date()}                           
                            onFocus={() => setOpen(true)}
                                    onChange={(e) => {
                                        setTime({ time: e.toISOString() })
                                        setOpen(false)
                                        get(e.toISOString())

                                    }}
                                    open={open}
                            
                        />
                    } />
            </Col>
            <Col md="1"></Col>
        </Row>
        <Row>
            <Card
                content={
                    <ReactTable
                        data={data}
                        columns={columns}
                        manual
                        defaultPageSize={10}
                        // onFetchData={get}
                        showPaginationBottom
                        showPaginationTop={false}
                        // pages={metaData ? metaData.pages : 1}
                        loading={loading}
                        sortable={false}
                        className="-striped -highlight"
                    />
                } />
        </Row>
    </div>)
}
export default Sale