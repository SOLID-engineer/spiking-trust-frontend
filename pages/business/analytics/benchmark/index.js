/* eslint-disable no-autofix/arrow-body-style */
/* eslint-disable react/jsx-props-no-spreading */
import axios from 'axios';
import BusinessLayout from 'components/business-layout';
import withCompany from 'components/hocs/withCompany';
import { debounce, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import BusinessSelector from 'slices/business/selector';

import Card from 'components/business/analytics/benchmark/Card';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Benchmark = () => {
  const currentCompany = useSelector(BusinessSelector.selectCurrentCompany);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [data, setData] = useState([]);

  const onQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const getSuggestions = async () => {
    if (query.length > 1) {
      const response = await axios.get('/search/suggestion', { params: { query } });
      setSuggestions(response.data);
    }
  };

  const debouncedGetSuggestions = useCallback(debounce(getSuggestions, 500), [query]);

  const getData = async () => {
    try {
      const response = await axios.get(`/business/benchmark/${currentCompany.domain}`);
      setData(response.data);
    } catch (error) {}
  };

  const handleAddCompany = async (uuid) => {
    try {
      await axios.post(`/business/benchmark/${currentCompany.domain}`, {
        company_uuid: uuid,
      });
      setQuery('');
      getData();
    } catch {}
  };

  const handleRemoveCompany = useCallback(async (uuid) => {
    try {
      await axios.delete(`/business/benchmark/${currentCompany.domain}/${uuid}`);
      getData();
    } catch {}
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newData = reorder(data, result.source.index, result.destination.index);
    const newPositions = newData.map((item, index) => {
      return { uuid: item.company_uuid, position: newData.length - index };
    });
    axios.post(`/business/benchmark/${currentCompany.domain}/positions`, {
      positions: newPositions,
    });
    setData(newData);
  };

  useEffect(() => {
    debouncedGetSuggestions();
    return debouncedGetSuggestions.cancel;
  }, [query, debouncedGetSuggestions]);

  useEffect(() => {
    if (currentCompany !== null) getData();
  }, [currentCompany]);

  return (
    <BusinessLayout pageTitle="Benchmark">
      <div>
        <div className="relative mb-4">
          <input
            type="text"
            className="bg-white px-6 py-4 border text-blue-500 hover:border-blue-500 flex-none"
            placeholder="Add another company"
            value={query}
            onChange={onQueryChange}
          />
          {query.length > 1 && (
            <div className="absolute w-80 bg-white shadow z-30">
              {!isEmpty(suggestions?.companies) &&
                suggestions.companies.map((company) => (
                  <button
                    type="button"
                    href={`/review/${company.domain}`}
                    key={company.id}
                    className="hover:bg-indigo-50 block px-3 py-2 w-full text-left"
                    onClick={() => handleAddCompany(company.uuid)}
                  >
                    <div className="font-bold text-base">{company.name || company.domain}</div>
                    <div>{company.domain}</div>
                  </button>
                ))}
            </div>
          )}
        </div>
        <div className="flex flex-row overflow-x-auto pb-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable direction="horizontal" droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  className="grid grid-flow-col"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {data.map((item, index) => (
                    <Draggable
                      key={item.company_uuid}
                      draggableId={item.company_uuid}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card
                            key={item.company_uuid}
                            uuid={item.company_uuid}
                            onRemove={handleRemoveCompany}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default withCompany(Benchmark);
