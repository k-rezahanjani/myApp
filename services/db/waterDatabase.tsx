import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('water.db');

export const createTables = async () => {
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS water_price_work (
      tblWaterPriceWorkId INTEGER PRIMARY KEY,
      tblZoneTypeId INTEGER,
      tblCycleTypeId INTEGER,
      tblEmployeeId INTEGER,
      tblReadLineId INTEGER,
      workKindDesc TEXT,
      year INTEGER,
      cycleNumber INTEGER,
      readLineCode TEXT,
      readLineDesc TEXT,
      createDate TEXT,
      createDateShamsi TEXT,
      cityDesc TEXT,
      zoneDesc TEXT,
      workKind INTEGER,
      cycleTypeDesc TEXT,
      allowSearch INTEGER,
      allowCellPhone INTEGER,
      allowPhone INTEGER,
      allowPostalCode INTEGER,
      waterPriceWorkCount INTEGER,
      readLineJson TEXT
    );

    CREATE TABLE IF NOT EXISTS water_price_read_info (
      tblWaterPriceWorkReadInfoId INTEGER PRIMARY KEY,
      tblWaterPriceWorkId INTEGER,
      tblUsageTypeInfoDetailId INTEGER,
      tblUsageTypeInfoDetailCurrId INTEGER,
      tblSubscriberId INTEGER,
      tblBoreTypeId INTEGER,
      subscriberCode TEXT,
      subscriberName TEXT,
      prevReadNumber REAL,
      readDate TEXT,
      readDateShamsi TEXT,
      readNumber REAL,
      useAmount REAL,
      tblReadStateTypeId INTEGER,
      tblReadViewTypeId INTEGER,
      address TEXT,
      identityCode TEXT,
      xLocation REAL,
      yLocation REAL,
      gisLocation TEXT,
      waterMeterSerial TEXT,
      usageDetailDesc TEXT,
      currentUsageDetailDesc TEXT,
      boreDesc TEXT,
      waterMeterPlump TEXT,
      waterMainUnitQty INTEGER,
      postalCode TEXT,
      cellPhone TEXT,
      phone TEXT,
      readViewDescs TEXT,
      prevReadDate TEXT,
      prevReadDateShamsi TEXT,
      readStateDesc TEXT,
      prevAvgAmount REAL,
      prevUseAmount REAL,
      waterDebtAmount REAL,
      sewageDebtAmount REAL,
      waterPriceDebtAmount REAL,
      controlResult TEXT,
      manualResult INTEGER,
      manualResultDesc TEXT,
      status TEXT,
      lastDebitPrice TEXT,
      description TEXT,
      FOREIGN KEY (tblWaterPriceWorkId) REFERENCES water_price_work (tblWaterPriceWorkId)
    );
  `);

    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_read_info_work_id ON water_price_read_info (tblWaterPriceWorkId);
    CREATE INDEX IF NOT EXISTS idx_read_info_subscriber_code ON water_price_read_info (subscriberCode);
  `);
};

export const saveDataToDatabase = async (apiResponse: any) => {
    const works = apiResponse.waterPriceWork;

    for (const work of works) {
        await db.runAsync(
            `INSERT OR REPLACE INTO water_price_work (
        tblWaterPriceWorkId, tblZoneTypeId, tblCycleTypeId, tblEmployeeId,
        tblReadLineId, workKindDesc, year, cycleNumber, readLineCode,
        readLineDesc, createDate, createDateShamsi, cityDesc, zoneDesc,
        workKind, cycleTypeDesc, allowSearch, allowCellPhone, allowPhone,
        allowPostalCode, waterPriceWorkCount, readLineJson
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                work.tblWaterPriceWorkId,
                work.tblZoneTypeId,
                work.tblCycleTypeId,
                work.tblEmployeeId,
                work.tblReadLineId,
                work.workKindDesc,
                work.year,
                work.cycleNumber,
                work.readLineCode,
                work.readLineDesc,
                work.createDate,
                work.createDateShamsi,
                work.cityDesc,
                work.zoneDesc,
                work.workKind,
                work.cycleTypeDesc,
                work.allowSearch ? 1 : 0,
                work.allowCellPhone ? 1 : 0,
                work.allowPhone ? 1 : 0,
                work.allowPostalCode ? 1 : 0,
                work.waterPriceWorkCount,
                JSON.stringify(work.readLine)
            ]
        );

        for (const info of work.waterPriceWorkReadInfo) {
            await db.runAsync(
                `INSERT OR REPLACE INTO water_price_read_info (
          tblWaterPriceWorkReadInfoId, tblWaterPriceWorkId,
          tblUsageTypeInfoDetailId, tblUsageTypeInfoDetailCurrId,
          tblSubscriberId, tblBoreTypeId, subscriberCode, subscriberName,
          prevReadNumber, readDate, readDateShamsi, readNumber, useAmount,
          tblReadStateTypeId, tblReadViewTypeId, address, identityCode,
          xLocation, yLocation, gisLocation, waterMeterSerial,
          usageDetailDesc, currentUsageDetailDesc, boreDesc, waterMeterPlump,
          waterMainUnitQty, postalCode, cellPhone, phone, readViewDescs,
          prevReadDate, prevReadDateShamsi, readStateDesc, prevAvgAmount,
          prevUseAmount, waterDebtAmount, sewageDebtAmount, waterPriceDebtAmount,
          controlResult, manualResult, manualResultDesc, status,
          lastDebitPrice, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    info.tblWaterPriceWorkReadInfoId,
                    work.tblWaterPriceWorkId,
                    info.tblUsageTypeInfoDetailId,
                    info.tblUsageTypeInfoDetailCurrId,
                    info.tblSubscriberId,
                    info.tblBoreTypeId,
                    info.subscriberCode,
                    info.subscriberName,
                    info.prevReadNumber,
                    info.readDate,
                    info.readDateShamsi,
                    info.readNumber,
                    info.useAmount,
                    info.tblReadStateTypeId,
                    info.tblReadViewTypeId,
                    info.address,
                    info.identityCode,
                    info.xLocation,
                    info.yLocation,
                    JSON.stringify(info.gisLocation),
                    info.waterMeterSerial,
                    info.usageDetailDesc,
                    info.currentUsageDetailDesc,
                    info.boreDesc,
                    info.waterMeterPlump,
                    info.waterMainUnitQty,
                    info.postalCode,
                    info.cellPhone,
                    info.phone,
                    info.readViewDescs,
                    info.prevReadDate,
                    info.prevReadDateShamsi,
                    info.readStateDesc,
                    info.prevAvgAmount,
                    info.prevUseAmount,
                    info.waterDebtAmount,
                    info.sewageDebtAmount,
                    info.waterPriceDebtAmount,
                    info.controlResult,
                    info.manualResult,
                    info.manualResultDesc,
                    info.status,
                    JSON.stringify(info.lastDebitPrice),
                    info.description
                ]
            );
        }
    }
};

export const getReadInfosForWork = async (workId: any) => {
    const result = await db.getAllAsync(
        `SELECT * FROM water_price_read_info WHERE tblWaterPriceWorkId = ?`,
        [workId]
    );
    return result.map((item: any) => ({
        ...item,
        gisLocation: item.gisLocation ? JSON.parse(item.gisLocation) : [],
        lastDebitPrice: item.lastDebitPrice ? JSON.parse(item.lastDebitPrice) : null
    }));
};


export const getNecessaryReadInfosForWork = async (workId: any) => {
    const result = await db.getAllAsync(
        `SELECT * FROM water_price_read_info WHERE tblWaterPriceWorkId = ?`,
        [workId]
    );
    return result;
};

export const getWaterReadInfosForWork = async (workId: any) => {
    const result = await db.getAllAsync(
        `SELECT * FROM water_price_read_info WHERE tblWaterPriceWorkId = ?`,
        [workId]
    );
    return result;
};
export const getReadInfoId = async (readInfoId: any) => {
    const result = await db.getAllAsync(
        `SELECT * FROM water_price_read_info WHERE tblWaterPriceWorkReadInfoId = ?`,
        [readInfoId]
    );
    return result;
};

export const getAllWorks = async () => {
    const result = await db.getAllAsync(`SELECT * FROM water_price_work`);
    return result.map((work: any) => ({
        ...work,
        readLine: work.readLineJson ? JSON.parse(work.readLineJson) : null
    }));
};

export const saveReadingInfo = async () => {
    const result = await db.getAllAsync(
        `UPDATE water_price_read_info SET readNumber = ?, readDate = ?, `
    )
}

export const searchByReadLine = async (query: string) => {
    debugger
    if (!query || query.trim() === '') {
        return getAllWorks();
    }

    const cleanQuery = query.trim().replace(/-/g, '');

    try {
        const worksByReadLine = await db.getAllAsync(
            `SELECT * FROM water_price_work 
       WHERE (readLineCode IS NOT NULL AND REPLACE(readLineCode, '-', '') LIKE ?)
          OR (readLineDesc IS NOT NULL AND readLineDesc LIKE ?)
          OR (cityDesc IS NOT NULL AND cityDesc LIKE ?)
          OR (zoneDesc IS NOT NULL AND zoneDesc LIKE ?)`,
            [`%${cleanQuery}%`, `%${query}%`, `%${query}%`, `%${query}%`]
        );

        const readInfos = await db.getAllAsync(
            `SELECT DISTINCT tblWaterPriceWorkId 
       FROM water_price_read_info 
       WHERE (subscriberCode IS NOT NULL AND subscriberCode = ?)
          OR (identityCode IS NOT NULL AND identityCode = ?)`,
            [query, query]
        );

        let worksBySubscriberIdentity: any[] = [];
        if (readInfos && readInfos.length > 0) {
            const workIds = readInfos
                .map((r: any) => r.tblWaterPriceWorkId)
                .filter(id => id != null);

            if (workIds.length > 0) {
                const placeholders = workIds.map(() => '?').join(',');
                worksBySubscriberIdentity = await db.getAllAsync(
                    `SELECT * FROM water_price_work WHERE tblWaterPriceWorkId IN (${placeholders})`,
                    workIds
                );
            }
        }

        const combined = [...worksByReadLine, ...worksBySubscriberIdentity];
        const uniqueWorks = combined.filter((work, index, self) =>
            index === self.findIndex(w => w?.tblWaterPriceWorkId === work?.tblWaterPriceWorkId)
        );

        return uniqueWorks;
    } catch (error) {
        console.error('Database search error:', error);
        return [];
    }
};

export const detailsInfo = async (id: number) => {
    return await db.getFirstAsync(
        `SELECT
        cityDesc,
        FROM water_price_work
        WHERE tblWaterPriceWorkId = ?`,
        [id]
    );
};