import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import Actions from "../../../modules/entity/actions";
import get from "lodash/get";
import {helpers} from "../../../services";

const OrdersModal = ({selected, showViewModal, setSelectedOrder}) => {
    const [items, setItems] = useState([]);

    const dispatch = useDispatch();
    const loadData = () => {
        dispatch(Actions.LoadDefault.request({
            url: `/dashboard/table-monitoring-ids`,
            params: {
                include: "user,waiter,payments,goods,booking.table",
                extra: {
                    closed_at: get(selected, 'closed_at'),
                    number: get(selected, 'number')
                }
            },
            cb: {
                success: data => {
                    setItems(data.data)
                },
                error: () => {}
            }
        }))
    }

    useEffect(() => {
        loadData();
    }, [])


    const totalTipPrice = items.reduce((prev,curr) => prev+Number(curr.tip_price), 0)
    const totalTotalPrice = items.reduce((prev,curr) => prev+Number(curr.total_price), 0)
    const totalTotalSum = items.reduce((prev,curr) => prev+Number(curr.total_sum), 0)

    return (
        <div className='pt-30'>
            <table className='bordered'>
                <thead>
                <tr>
                    <th>Номер заказа</th>
                    <th>Сумма обслуги</th>
                    <th>Сумма блюд</th>
                    <th>Сумма</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr>
                        <td>{get(item, 'order_number')}</td>
                        <td>{helpers.convertToReadable(get(item, 'tip_price', 0))}</td>
                        <td>{helpers.convertToReadable(get(item, 'total_price', 0))}</td>
                        <td>{helpers.convertToReadable(get(item, 'total_sum', 0))}</td>
                        <td>
                            <div className='cr-blue cursor-pointer' onClick={() => {
                                showViewModal(true)
                                setSelectedOrder(item)
                            }}>Детали</div>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td>Всего:</td>
                    <td>{totalTipPrice ? helpers.convertToReadable(totalTipPrice) : '0'}</td>
                    <td>{totalTotalPrice ? helpers.convertToReadable(totalTotalPrice) : '0'}</td>
                    <td>{totalTotalSum ? helpers.convertToReadable(totalTotalSum) : '0'}</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default OrdersModal;