import SQLiteStorage from 'react-native-sqlite-storage';
import { Platform } from 'react-native';

SQLiteStorage.DEBUG(__DEV__);       // 启动调试信息
SQLiteStorage.enablePromise(true);  // 使用 promise(true) 或者 callback(false)

export default class SQLite {
    static delete(database) {
        return SQLiteStorage.deleteDatabase(database)
        .then(res => ({ res }))
        .catch(err => ({ err }));
    }

    constructor(databaseName, databaseLocation) {
        this.databaseName = databaseName;
        this.databaseLocation = databaseLocation;
        this.successInfo = (text, absolutely) => {
            if (__DEV__) {
                if (absolutely) {
                    console.log(text);
                } else {
                    console.log(`SQLiteHelper ${text} success.`);
                }
            }
        };
        this.errorInfo = (text, err, absolutely) => {
            if (__DEV__) {
                if (absolutely) {
                    console.log(text);
                } else {
                    console.log(`SQLiteHelper ${text} error: ${err.message}`);
                }
            }
        };
        this.open = this._open.bind(this);
        this.close = this._close.bind(this);
        this.createTable = this._createTable.bind(this);
        this.dropTable = this._dropTable.bind(this);
        this.insertItems = this._insertItems.bind(this);
        this.deleteItem = this._deleteItem.bind(this);
        this.updateItem = this._updateItem.bind(this);
        this.selectItems = this._selectItems.bind(this);
        this.queryItems = this._queryItems.bind(this);
    }

    async _open() {
        var opts = Platform.OS == "ios" ? {name: this.databaseName, location: this.databaseLocation} :
                                    {name: this.databaseName, createFromLocation : this.databaseName};
        const result = await SQLiteStorage.openDatabase(opts)
        .then((db) => {
            this.successInfo('open');
            return { res: db };
        })
        .catch((err) => {
            this.errorInfo('open', err);
            return { err };
        });
        if (result.res) {
            this.db = result.res;
        }
        return result;
    }

    async _close() {
        if (this.db) {
            const result = await this.db.close()
            .then(() => {
                this.successInfo('close');
                return { res: ['database was closed'] };
            })
            .catch((err) => {
                this.errorInfo('close', err);
                return { err };
            });
            this.db = null;
            return result;
        }
        this.successInfo('SQLiteStorage haven not opened', true);
        return true;
    }

    async _createTable(tableInfo) {
        const { tableName, tableFields } = tableInfo;
        if (!this.db) {
            await this.open();
        }
        // sql语句累加
        const sqlStr = tableFields.reduce((sqlSegment, field, index, arr) => (
            `${sqlSegment} ${field.columnName} ${field.dataType} ${index + 1 === arr.length ? ');' : ','}`
        ), `CREATE TABLE IF NOT EXISTS ${tableName}(`);
        // 创建表
        return await this.db.executeSql(sqlStr)
        .then((res) => {
            this.successInfo('createTable');
            return { res };
        })
        .catch((err) => {
            this.errorInfo('createTable', err);
            return { err };
        });
    }

    async _dropTable(tableName) {
        if (!this.db) {
            await this.open();
        }
        // 删除表
        return await this.db.executeSql(`DROP TABLE ${tableName};`)
        .then((res) => {
            this.successInfo('dropTable');
            return { res };
        })
        .catch((err) => {
            this.errorInfo('dropTable', err);
            return { err };
        });
    }

    async _insertItems(tableName, items) {
        if (!this.db) {
            await this.open();
        }
        const sqlStrArr = items.map((item) => {
            const columns = Object.keys(item);
            let sqlStr = columns.reduce((sqlSegment, columnName, index, arr) => (
                `${sqlSegment} ${columnName} ${index + 1 === arr.length ? ')' : ','}`
            ), `INSERT INTO ${tableName} (`);
            sqlStr += columns.reduce((sqlSegment, columnName, index, arr) => (
                `${sqlSegment} '${item[columnName]}' ${index + 1 === arr.length ? ');' : ','}`
            ), ' VALUES (');
            return sqlStr;
        });
        return await this.db.sqlBatch(sqlStrArr)
        .then(() => {
            this.successInfo('insertItemsBatch');
            return { res: ['databases execute sqlBatch success'] };
        })
        .catch((err) => {
            this.errorInfo('insertItemsBatch', err);
            return { err };
        });
    }

    async _deleteItem(tableName, condition) {
        if (!this.db) {
            await this.open();
        }
        let sqlStr;
        if (condition && typeof condition === 'object' && condition !== {}) {
            const conditionKeys = Object.keys(condition);
            sqlStr = conditionKeys.reduce((sqlSegment, conditionKey, index, arr) => (
                `${sqlSegment} ${conditionKey}='${condition[conditionKey]}' ${index + 1 !== arr.length ? 'and' : ';'}`
            ), `DELETE FROM ${tableName} WHERE`);
        } else {
            sqlStr = `DELETE FROM ${tableName}`;
        }
        return await this.db.executeSql(sqlStr)
        .then((res) => {
            this.successInfo(`SQLiteStorage deleteItem success: 影响 ${res[0].rowsAffected} 行`, true);
            return { res };
        })
        .catch((err) => {
            this.errorInfo('deleteItem', err);
            return { err };
        });
    }

    async _updateItem(tableName, item, condition) {
        if (!this.db) {
            await this.open();
        }
        const columns = Object.keys(item);
        let sqlStr;
        sqlStr = columns.reduce((sqlSegment, columnName, index, arr) => (
            `${sqlSegment} ${columnName}='${item[columnName]}' ${index + 1 !== arr.length ? ',' : ''}`
        ), `UPDATE ${tableName} SET`);
        if (condition && condition !== {} && typeof condition === 'object') {
            const conditionKeys = Object.keys(condition);
            sqlStr += conditionKeys.reduce((sqlSegment, conditionKey, index, arr) => (
                `${sqlSegment} ${conditionKey}='${condition[conditionKey]}' ${index + 1 !== arr.length ? 'AND' : ';'}`
            ), ' WHERE');
        } else sqlStr += ';';
        return await this.db.executeSql(sqlStr)
        .then((res) => {
            this.successInfo(`SQLiteStorage updateItem success: 影响 ${res[0].rowsAffected} 行`, true);
            return { res };
        })
        .catch((err) => {
            this.errorInfo('updateItem', err);
            return { err };
        });
    }

    async _queryItems(formatter, sqlStr) {
        if (!this.db) {
            await this.open();
        }
        return await this.db.executeSql(sqlStr)
        .then((res) => {
            const queryResult = [];
            this.successInfo(`SQLiteStorage queryItems success: ${res[0].rows.length}`, true);
            const len = res[0].rows.length;
            for (let i = 0; i < len; i++) {
                let row = res[0].rows.item(i);
                queryResult.push(formatter ? formatter(row, i) : row);
            }
            return { res: queryResult };
        })
        .catch((err) => {
            this.errorInfo('queryItems', err);
            return { err };
        });
    }

    // perPageNum starts at 0
    async _selectItems(formatter, tableName, columns, conditions, pagination, perPageNum, orderby) {
        if (!this.db) {
            await this.open();
        }
        let sqlStr;
        if (columns === '*') {
            if (conditions && conditions.length) {
                if (__DEV__) {  console.log(conditions); }
                sqlStr = conditions.reduce((sqlSegment, condition, index, arr) => (
                    `${sqlSegment} ${condition} ${index + 1 !== arr.length ? 'AND' : ''}`
                ), `SELECT DISTINCT * FROM ${tableName} WHERE`);
            } else {
                sqlStr = `SELECT DISTINCT * FROM ${tableName}`;
            }
        } else {
            sqlStr = columns.reduce((sqlSegment, column, index, arr) => (
                `${sqlSegment} ${column} ${index + 1 !== arr.length ? ',' : ''}`
            ), 'SELECT DISTINCT');
            if (conditions && conditions.length) {
                sqlStr += conditions.reduce((sqlSegment, condition, index, arr) => (
                    `${sqlSegment} ${condition} ${index + 1 !== arr.length ? 'AND' : ''}`
                ), ` FROM ${tableName} WHERE`);
            } else {
                sqlStr += ` FROM ${tableName}`;
            }
        }
        if (orderby) {
            sqlStr += ' ORDER BY ' + orderby;
        }
        if (pagination && perPageNum) {
            const limit = pagination * perPageNum;
            const offset = (perPageNum - 1) * (pagination - 1) > 0 ? perPageNum * (pagination - 1) : 0;
            sqlStr += ` limit ${limit} offset ${offset};`;
        } else {
            sqlStr += ';';
        }
        if (__DEV__) { console.log(sqlStr); }
        return await this.db.executeSql(sqlStr)
        .then((res) => {
            const queryResult = [];
            this.successInfo(`SQLiteStorage selectItems success: ${res[0].rows.length}`, true);
            const len = res[0].rows.length;
            for (let i = 0; i < len; i++) {
                let row = res[0].rows.item(i);
                queryResult.push(formatter ? formatter(row, i) : row);
            }
            return { res: queryResult };
        })
        .catch((err) => {
            this.errorInfo('selectItems', err);
            return { err };
        });
    }
}
