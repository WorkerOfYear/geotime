import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';

import Tables from "../components/Table";
import HeadTable from "../components/HeadTable";
import Item from "../components/Item";
import { useAppDispatch } from "../hooks/redux";
import { IGetReportSettings, IReport } from "../types/IReport";
import { getCountPages, getReport, saveReport } from "../store/reducers/actions/ReportActionCreators";

interface selectedItem {
    selected: number
}

const History = () => {
    const [date, setDate] = useState<IGetReportSettings>({
        date_from: "",
        date_to: "",
        page: 0,
        limit: 20,
    });

    const [reports, setReports] = useState<IReport[]>([])
    const [pagesCount, setPagesCount] = useState<number>(0)

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getReport(date)).then((data) => {
            if(data) {
                setReports(data)
                dispatch(getCountPages()).then(data => {
                    if (data?.count_pages) {
                        setPagesCount(data.count_pages)
                    }
                })
            }
        })
    }, [date])

    const handleFromChange = (e: React.FormEvent<HTMLInputElement>) => {
        setDate({...date, date_from: e.currentTarget.value})
    }
    const handleToChange = (e: React.FormEvent<HTMLInputElement>) => {
        setDate({...date, date_to: e.currentTarget.value} )
    }
    const handlePageClick = (selectedItem: selectedItem) => {
        setDate({...date, page: selectedItem.selected})
    }
    const handleLoadReports = () => {
        dispatch(saveReport({date_from: date.date_from, date_to: date.date_to})).then((data) => {
            if (data) {
                const url = window.URL.createObjectURL(new Blob([data]))
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${Date.now()}.xlsx`);
                document.body.appendChild(link);
                link.click();
            }
        })
    }
    
    return (
        <div className="history">
            <div className="history__wrapper">
                <div className="history__header">
                    <Item value={date.date_from} onChange={handleFromChange} label={"Фильтр от"} type={"datetime-local"} />
                    <Item value={date.date_to} onChange={handleToChange} label={"Фильтр до"} type={"datetime-local"} />
                    <button onClick={handleLoadReports} className="history__btn">Выгрузить отчёт</button>
                    <Link className="history__link button" to="/">
                        На главную
                    </Link>
                </div>
            </div>
            <HeadTable className={"history__table-head"} />
            <div className="history__body">
                 <Tables
                    id={4}
                    reports={reports}
                    showStream={false}
                    classBody={"history__table-body"}
                />
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel="вперёд >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pagesCount}
                previousLabel="< назад"
                renderOnZeroPageCount={null}
                containerClassName="react-paginate"
            />
            <div className="history__list"></div>
        </div>
    );
};

export default History;
