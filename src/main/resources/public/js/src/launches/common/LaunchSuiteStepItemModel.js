/*
 * Copyright 2016 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/epam/ReportPortal
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */
define(function(require, exports, module) {
    'use strict';

    var Epoxy = require('backbone-epoxy');
    var _ = require('underscore');
    var Util = require('util');
    var App = require('app');

    var config = App.getInstance();

    var LaunchSuiteStepItemModel = Epoxy.Model.extend({
        defaults: {
            approximateDuration: 0,
            description: '',
            id: '',
            isProcessing: false,
            isShared: false,
            mode: '',
            name: '',
            number: 0,
            owner: '',
            start_time: 0,
            end_time: 0,
            statistics: {
                defects: {},
                executions: {},
            },
            status: '',
            tags: '',
            type: '',

            //test step append
            has_childs: true,
            issue: '',

            select: false,
            invalidMessage: '',

            // append keys
            level: '',
            parent_launch_owner: null,
            parent_launch_status: null,
            parent_launch_isProcessing: null,
            parent_launch_investigate: null,
        },
        computeds: {
            launch_owner: {
                deps: ['owner', 'parent_launch_owner'],
                get: function (owner, parent_launch_owner) {
                    return parent_launch_owner || owner;
                }
            },
            launch_status: {
                deps: ['status', 'parent_launch_status'],
                get: function (status, parent_launch_status) {
                    return parent_launch_status || status;
                }
            },
            launch_isProcessing: {
                deps: ['isProcessing', 'parent_launch_isProcessing'],
                get: function (isProcessing, parent_launch_isProcessing) {
                    if (parent_launch_isProcessing != null) {
                        return parent_launch_isProcessing;
                    }
                    return isProcessing;
                }
            },
            launch_toInvestigate: {
                deps: ['parent_launch_investigate', 'statistics'],
                get: function(parentLaunchInvestigate, statistics) {
                    if(parentLaunchInvestigate != null) {
                        return parentLaunchInvestigate;
                    }
                    var statistics = this.get('statistics');
                    if(statistics && statistics.defects && statistics.defects.to_investigate) {
                        return statistics.defects.to_investigate.total;
                    }
                    return 0;
                }
            },
            url: {
                deps: ['id', 'has_childs'],
                get: function (id, has_childs) {
                    if (has_childs) {
                        return window.location.hash.split('?')[0] + '/' + id;
                    }
                    return '';
                }
            },
            numberText: {
                deps: ['number'],
                get: function (number) {
                    if (!number) {
                        return ''
                    }
                    return '# ' + number;
                }
            },
            sortTags: {
                deps: ['tags'],
                get: function (tags) {
                    return _.sortBy(tags, function (t) {
                        return t.toUpperCase() === 'BUILD' || t.indexOf('uild') !== -1;
                    });
                }
            },
            startFormat: {
                deps: ['start_time'],
                get: function (startTime) {
                    return Util.dateFormat(startTime)
                }
            },
            startFromNow: {
                deps: ['startFormat'],
                get: function (startFormat) {
                    return Util.fromNowFormat(startFormat)
                }
            },
            // isProgress: {
            //     deps: ['status'],
            //     get: function(status) {
            //         return status == 'IN_PROGRESS';
            //     }
            // },
            // isSkipped: {
            //     deps: ['status'],
            //     get: function(status) {
            //         return status == 'SKIPPED';
            //     }
            // },
            // isStopped: {
            //     deps: ['status'],
            //     get: function(status) {
            //         return status == 'STOPPED';
            //     }
            // },
            // isInterrupted: {
            //     deps: ['status'],
            //     get: function(status) {
            //         return (status == 'INTERRUPTED') || (status == 'STOPPED');
            //     }
            // },
            formatEndTime: {
                deps: ['end_time'],
                get: function (endTime) {
                    return Util.dateFormat(endTime, true);
                }
            },
        },
        initialize: function() {
            this.validate = this.getValidate();
        },
        getIssue: function () {
            try {
                return JSON.parse(this.get('issue'));
            } catch (err) {
                return {};
            }
        },
        setIssue: function (issue) {
            this.set({issue: JSON.stringify(issue)});
        },
        getTags: function () {
            try {
                return JSON.parse(this.get('tags'));
            } catch (err) {
                return [];
            }
        },
        setTags: function (tags) {
            this.set({issue: JSON.stringify(tags)});
        },
        getValidate: function () {
            var self = this;
            var result = {
                merge: function () {
                    if (self.get('launch_owner') != config.userModel.get('name')) {
                        return 'You are not a launch owner';
                    }
                    if (self.get('launch_status') == 'IN_PROGRESS') {
                        return 'Launch should not be in the status IN PROGRESS';
                    }
                    if (self.get('launch_isProcessing')) {
                        return 'Launch should not be processing by Auto Analysis';
                    }
                    return ''
                },
                changeMode: function () {
                    if (self.get('launch_owner') != config.userModel.get('name')) {
                        return 'You are not a launch owner';
                    }
                    return ''
                },
                forceFinish: function() {
                    if (self.get('status') != 'IN_PROGRESS') {
                        return 'Launch is already finished';
                    }
                    if (self.get('launch_owner') != config.userModel.get('name')) {
                        return 'You are not a launch owner';
                    }
                    return '';
                },
                remove: function() {
                    if (self.get('launch_owner') != config.userModel.get('name')) {
                        return 'You are not a launch owner';
                    }
                    if (self.get('launch_status') == 'IN_PROGRESS') {
                        return 'Launch should not be in the status IN PROGRESS';
                    }
                    return '';
                }
            }
            return result;
        },

    });

    return LaunchSuiteStepItemModel;
});