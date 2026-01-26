function TodoViewForm({
    sortDirection,
    setSortDirection,
    sortField,
    setSortField,
    queryString,
    setQueryString
}) {
    const preventRefresh = (e) => {
        e.preventDefault();
    };

    return(
        <form className="view-form" onSubmit={preventRefresh}>
            <div className="search-controls">
                <label htmlFor="search">Search todos:</label>
                <input 
                id="search" 
                type="text" 
                value={queryString} onChange={(e) => setQueryString(e.target.value)}
                placeholder="Type to fillter..."
                />
                <button 
                type="button" 
                onClick={() => setQueryString("")}>
                    Clear
                    </button>
            </div>
            <div className="form-controls">
                <label htmlFor="sortField">Sort by:</label>
                <select 
                id = "sortField" 
                value={sortField} 
                onChange={(e) => setSortField(e.target.value)}
                >
                    <option value="title">Title</option>
                    <option value="createdTime">Time added</option>
                </select>

                <label htmlFor="sortDirection">Direction:</label>
                <select 
                id="sortDirection" 
                value={sortDirection} 
                onChange={(e) => setSortDirection(e.target.value)}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </form>
    );
}

export default TodoViewForm;