-- =============================================================================
-- 表名：dm_ll.dwd_cl_shipment_package_out_warehouse_d (出库包裹明细表)
-- 用途：构造符合预警边界条件的测试数据，并提供规则校验查询。
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 场景一：上海仓库揽收即将超时预警
-- 业务逻辑：上海仓 + process_type=0 + status=900 + 实际揽收为空 + (当前时间 - 最晚发货时间 <= 1小时)
-- -----------------------------------------------------------------------------

-- 1. 构造测试数据（修改现有数据命中规则）
-- 将某条现有的数据修改为“即将超时（距离超时还剩 30 分钟）”的临界状态
UPDATE dm_ll.dwd_cl_shipment_package_out_warehouse_d
SET 
    warehouse_name = '上海嘉定仓',
    process_type = 0,             -- 处理类型：正常
    status = 900,                 -- 状态：出库完成
    receive_time = NULL,          -- 实际揽收时间为空 (平替 gusset_time)
    -- 假设此时是中午 12:00，我们将应揽收时间设置为 12:30。
    -- 那么 (当前时间 12:00) - (应揽收 12:30) = -30分钟 <= 1小时，符合即将超时的预警阈值
    latest_delivery_time = DATE_ADD(NOW(), INTERVAL 30 MINUTE) 
WHERE id = '测试包裹ID_001';

-- 2. 预警平台对应的查询 / 校验 SQL
SELECT 
    id AS "预警单号",
    warehouse_name,
    latest_delivery_time AS "应揽收时间"
FROM dm_ll.dwd_cl_shipment_package_out_warehouse_d
WHERE 
    warehouse_name LIKE '%上海%'
    AND process_type = 0
    AND status = 900
    AND receive_time IS NULL -- (或 gusset_time IS NULL)
    -- 当前时间 - 应揽收时间 <= 1小时 (使用 TIMESTAMPDIFF 计算差值)
    AND TIMESTAMPDIFF(MINUTE, latest_delivery_time, NOW()) <= 60;


-- -----------------------------------------------------------------------------
-- 场景二：全部已发出快递疑似遗失预警
-- 业务逻辑：process_type=0 + shipped_time不为空 + sign_time为空 + 最新轨迹更新时间(update_time)停留在了 2天前
-- -----------------------------------------------------------------------------

-- 1. 构造测试数据（修改现有数据命中规则）
-- 构造一条“发货了很久，但2天没有轨迹更新，且未签收”的数据
UPDATE dm_ll.dwd_cl_shipment_package_out_warehouse_d
SET 
    process_type = 0,                           -- 处理类型：正常
    status = 900,                               -- 状态：出库完成
    shipped_time = DATE_SUB(NOW(), INTERVAL 5 DAY), -- 发运时间：5天前已经发货
    sign_time = NULL,                           -- 签收时间：为空
    -- 最新轨迹更新时间停留在了 2天前 (超过48小时无动静)
    update_time = DATE_SUB(NOW(), INTERVAL 2 DAY) 
WHERE id = '测试包裹ID_002';

-- 2. 预警平台对应的查询 / 校验 SQL
SELECT 
    id AS "疑似遗失单号",
    shipped_time AS "发货时间",
    update_time AS "最新轨迹时间"
FROM dm_ll.dwd_cl_shipment_package_out_warehouse_d
WHERE 
    process_type = 0
    AND shipped_time IS NOT NULL  -- 有发件时间
    AND sign_time IS NULL         -- 未签收
    -- 最新轨迹更新时间 <= 当前时间减去2天 (即超过48小时未更新)
    AND update_time <= DATE_SUB(NOW(), INTERVAL 2 DAY);
