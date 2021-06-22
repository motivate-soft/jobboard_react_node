import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import JobListTableRow from "./JobListTableRow";
import InfiniteScroll from "react-infinite-scroll-component";
import jobApi from "../../service/jobApi";
import Loader from "./../Shared/Loader/Loader";

const PAGE_SIZE = 10;
export default function JobListTable(props) {
  const { onClickRow } = props;

  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  // const [nextHref, setNextHref] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState({
    limit: PAGE_SIZE,
    page,
  });

  useEffect(() => {
    if (items.length === 0) {
      fetchInitialData();
    }
  }, []);

  useEffect(() => {
    setQuery({
      ...query,
      page,
    });
  }, [page]);

  async function fetchInitialData() {
    try {
      const { data } = await jobApi.getListing(query);
      const { pageIndex, from, to, recordsFiltered, recordsTotal } = data;
      console.log("JobListTable->fetchInitialData:data", data);

      setItems(items.concat(data.items));
      if (to < recordsFiltered) {
        setHasMore(true);
        setPage(pageIndex + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("JobListTable->fetchInitialData", error);
    }
  }

  async function fetchItems() {
    try {
      const { data } = await jobApi.getListing(query);
      const { pageIndex, from, to, recordsFiltered, recordsTotal } = data;
      console.log("JobListTable->fetchItems:data", data);

      setItems(items.concat(data.items));
      if (to < recordsFiltered) {
        setHasMore(true);
        setPage(pageIndex + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("JobListTable->fetchItems:error", error);
    }
  }

  return (
    <div className="container mx-auto flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <InfiniteScroll
              style={{
                height: "70vh",
                overflow: "auto",
                minHeight: "0 !important",
              }}
              className="ant-row"
              // style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
              dataLength={items.length}
              next={fetchItems}
              hasMore={hasMore}
              loader={<Loader />}
              height={500}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Salary
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Apply</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((job, index) => (
                    <JobListTableRow
                      key={index}
                      job={job}
                      onClick={onClickRow}
                    />
                  ))}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
