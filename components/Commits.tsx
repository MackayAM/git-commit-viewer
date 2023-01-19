import { useReducer, useEffect, useState } from 'react';
import { COMMIT_URL } from '../lib/config';
import Commit from './Commit';
import _ from 'lodash';

const initialState = {
    commits: [],
    loading: true,
    error: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, commits: action.payload, loading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
}

const UserFilterButton = ({ isActive, userName, handleClick }) => {
    const getInitials = (name) => {
        const names = name.split(" ");
        return names.length === 1 ? names[0][0].toUpperCase() : `${names[0][0].toUpperCase()}${names[names.length - 1][0].toUpperCase()}`
    }
    return (<div className={`circle-button mr-2 cursor-pointer${!isActive ? ' circle-button--inactive' : ''}`} onClick={handleClick}>
        <span className="initials">{getInitials(userName)}</span>
    </div>)
}

const Commits = () => {
    let searchTimeout;

    const [state, dispatch] = useReducer(reducer, initialState);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [viewType, setViewType] = useState<string>('list');
    const [userFilter, setUserFilter] = useState(null);

    const debouncedSetSearchFilter = (searchFilter) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => setSearchFilter(searchFilter), 700);
    }

    const handleSearchInput = (event) => {
        const searchFilter = event.target.value;
        debouncedSetSearchFilter(searchFilter);
    }

    const handleFilters = (commit) => {
        if (!searchFilter) {
            return !userFilter || userFilter.includes(commit.commit.committer.name);
        }

        if (userFilter && !userFilter.includes(commit.commit.committer.name)) {
            return false;
        }

        const searchableAttributes = [commit.commit.committer.name, commit.commit.committer.email, commit.commit.message, commit.commit.url]

        return searchableAttributes.some((v) => v.toLowerCase().indexOf(searchFilter) >= 0);
    }

    const getUniqueUsers = () => {
        return _.uniq(state.commits.map((v) => v.commit.committer.name));
    }

    const toggleUserFilter = (user: string) => {
        const currentFilteredUsers = userFilter || getUniqueUsers();
        setUserFilter(currentFilteredUsers.includes(user) ? currentFilteredUsers.filter((v) => v !== user) : [...currentFilteredUsers, user]);
    }

    useEffect(() => {
        fetch(COMMIT_URL)
            .then(response => response.json())
            .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
            .catch(error => dispatch({ type: 'FETCH_ERROR', payload: error }));
    }, []);

    if (state.loading) {
        return <div>Loading...</div>;
    }

    if (state.error) {
        return <div>{state.error}</div>
    }


    return (
        <div className="bg-white p-8 text-center">
            <div className="flex justify-between">
                <div className="flex">
                    <button className={`px-4 py-2 mr-2 rounded-lg ${viewType === 'list' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`} onClick={() => setViewType('list')}>
                        <svg className="inline-block w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"></path>
                        </svg>
                        List View
                    </button>
                    <button className={`px-4 py-2 rounded-lg ${viewType === 'grid' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`} onClick={() => setViewType('grid')}>
                        <svg className="inline-block w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Grid View
                    </button>
                </div>
                <div className="relative mx-auto">
                    <input className="px-4 py-2 rounded-lg bg-blue-100 text-blue-500 w-full" type="text" placeholder="Search..." onChange={handleSearchInput} />
                    <div className="absolute right-0 top-0 px-3 py-22 mt-1">
                        <svg className="w-4 h-8" fill="currentColor" viewBox="0 -10 20 40">
                            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                        </svg>
                    </div>
                </div>
                <div className="flex">
                    <label className="mr-4 font-semibold mt-2">Committers: </label>
                    {state.commits.length && getUniqueUsers().map((user: string) => (
                        <UserFilterButton isActive={!userFilter || userFilter.includes(user)} userName={user} handleClick={(e) => toggleUserFilter(user)} />
                    ))}
                </div>
            </div>
            <div className="mt-8">
                {!state.commits.filter(handleFilters).length && <p>No results to display for selected filters.</p>}
                {viewType === 'grid' && (<div className="inline-grid grid-rows-2 gap-4 lg:grid-cols-6 sm:grid-cols-3">
                    {state.commits.filter(handleFilters).map(commit => (
                        <Commit key={commit.sha} data={commit} />
                    ))}
                </div>)}
                {viewType === 'list' && (<div className="inline-grid gap-4 lg:grid-cols-1 sm:grid-cols-1">
                    {state.commits.filter(handleFilters).map(commit => (
                        <Commit key={commit.sha} data={commit} />
                    ))}
                </div>)}
            </div>
        </div>
    )

}

export default Commits;