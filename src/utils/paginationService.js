const BluebirdPromise = require('bluebird');

const paginateService = (Model) => {
    const getAggregationData = (aggregation = [], paramAggOptions = {}, fieldsSelection = null) =>
        new BluebirdPromise((resolve, reject) => {
            const options = {};
            let matchQuery = {};
            const aggOptions = paramAggOptions;
            options.limit = parseInt(options.limit, 10);
            if (!('limit' in aggOptions) || Number.isNaN(aggOptions.limit)) {
                options.limit = 20;
            } else {
                options.limit = aggOptions.limit;
            }
            if (!('pageIndex' in aggOptions)) {
                options.skip = 0;
            } else {
                options.skip = (aggOptions.pageIndex - 1) * options.limit;
            }
            if ('sortBy' in aggOptions) {
                options.sort = {};
                options.sort[aggOptions.sortBy] = aggOptions.sortOrder === 'asc' ? 1 : -1;
            }
            if ('columnSearch' in aggOptions && Object.keys(aggOptions.columnSearch).length > 0) {
                matchQuery = { $match: { $and: [aggOptions.columnSearch] } };
            }
            if ('globalSearch' in aggOptions && aggOptions.globalSearch.length > 0) {
                matchQuery = { $match: { $or: aggOptions.globalSearch } };
            }
            if (
                'globalSearch' in aggOptions &&
                aggOptions.globalSearch.length > 0 &&
                'columnSearch' in aggOptions &&
                Object.keys(aggOptions.columnSearch).length > 0
            ) {
                matchQuery = {
                    $match: {
                        $and: [
                            { $and: [aggOptions.columnSearch] },
                            { $or: aggOptions.globalSearch }
                        ]
                    }
                };
            }
            if (fieldsSelection) {
                aggregation.push({ $project: fieldsSelection });
            }

            const optionsArray = [];
            if (options.sort) {
                aggregation.push({ $sort: options.sort });
            }
            if (matchQuery && Object.keys(matchQuery).length > 0) aggregation.push(matchQuery);
            optionsArray.push({ $skip: options.skip });
            optionsArray.push({ $limit: Number(options.limit) });
            aggregation.push({
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: optionsArray // add projection here wish you re-shape the docs
                }
            });
            Model.aggregate(aggregation, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        data: result[0].data,
                        totalPages: result[0].metadata[0]
                            ? Math.ceil(result[0].metadata[0].total / options.limit)
                            : 0,
                        totalRecords: result[0].metadata[0] ? result[0].metadata[0].total : 0,
                        currentPage: parseFloat(aggOptions.pageIndex),
                        pageLimit: options.limit
                    });
                }
            });
        });
    return {
        getAggregationData
    };
};
module.exports = paginateService;
