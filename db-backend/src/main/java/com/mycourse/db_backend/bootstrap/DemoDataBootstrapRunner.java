package com.mycourse.db_backend.bootstrap;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.mycourse.db_backend.location.Location;
import com.mycourse.db_backend.location.LocationRepository;
import com.mycourse.db_backend.pricing.PricingPolicy;
import com.mycourse.db_backend.pricing.PricingPolicyRepository;
import com.mycourse.db_backend.space.Space;
import com.mycourse.db_backend.space.SpaceRepository;
/**
 * 演示数据启动初始化启动执行器，用来在系统启动时执行初始化动作。
 */
@Component
public class DemoDataBootstrapRunner implements ApplicationRunner {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DemoDataBootstrapRunner.class);
/**
 * 位置仓库，用来访问数据库。
 */
private final LocationRepository locationRepository;
/**
 * 计费策略仓库，用来访问数据库。
 */
private final PricingPolicyRepository pricingPolicyRepository;
/**
 * 空间仓库，用来访问数据库。
 */
private final SpaceRepository spaceRepository;
    /**
     * 在应用启动后执行初始化逻辑。
     */
@Override
    @Transactional
    public void run(ApplicationArguments args) {
        PricingPolicy freePolicy = ensureFreePolicy();
        PricingPolicy paidPolicy = ensurePaidPolicy();
        Location roomLocation = ensureDefaultLocations();
        ensureDefaultSpaces(roomLocation, freePolicy, paidPolicy);
    }
/**
 * 确保免费策略已经准备好；如果不存在就自动创建。
 */
private PricingPolicy ensureFreePolicy() {
        List<PricingPolicy> policies = pricingPolicyRepository.findAll(Sort.by(Sort.Direction.ASC, "policyId"));
        for (PricingPolicy policy : policies) {
            if ("FREE".equals(policy.getChargeMode())) {
                return policy;
            }
        }
        LocalDateTime now = LocalDateTime.now();
        PricingPolicy policy = new PricingPolicy();
        policy.setPolicyCode("FREE-DEFAULT");
        policy.setPolicyName("Default Free Policy");
        policy.setChargeMode("FREE");
        policy.setHourlyPrice(BigDecimal.ZERO);
        policy.setFreeMinutes(120);
        policy.setMaxReserveHours(4);
        policy.setDepositAmount(BigDecimal.ZERO);
        policy.setOvertimePriceMultiplier(new BigDecimal("1.50"));
        policy.setAllowTempHold(1);
        policy.setTempHoldLimitMinutes(15);
        policy.setTempHoldMaxCount(2);
        policy.setIsActive(1);
        policy.setValidFrom(now);
        policy.setRemarks("Bootstrap free policy");
        policy.setCreatedAt(now);
        policy.setUpdatedAt(now);
        policy.setIsDeleted(0);
        PricingPolicy saved = pricingPolicyRepository.save(policy);
        log.info("Bootstrapped free pricing policy");
        return saved;
    }
/**
 * 确保paid策略已经准备好；如果不存在就自动创建。
 */
private PricingPolicy ensurePaidPolicy() {
        List<PricingPolicy> policies = pricingPolicyRepository.findAll(Sort.by(Sort.Direction.ASC, "policyId"));
        for (PricingPolicy policy : policies) {
            if ("PAID".equals(policy.getChargeMode())) {
                return policy;
            }
        }
        LocalDateTime now = LocalDateTime.now();
        PricingPolicy policy = new PricingPolicy();
        policy.setPolicyCode("PAID-DEFAULT");
        policy.setPolicyName("Default Paid Policy");
        policy.setChargeMode("PAID");
        policy.setHourlyPrice(new BigDecimal("18.00"));
        policy.setFreeMinutes(15);
        policy.setMaxReserveHours(6);
        policy.setDepositAmount(BigDecimal.ZERO);
        policy.setOvertimePriceMultiplier(new BigDecimal("1.50"));
        policy.setAllowTempHold(1);
        policy.setTempHoldLimitMinutes(10);
        policy.setTempHoldMaxCount(2);
        policy.setIsActive(1);
        policy.setValidFrom(now);
        policy.setRemarks("Bootstrap paid policy");
        policy.setCreatedAt(now);
        policy.setUpdatedAt(now);
        policy.setIsDeleted(0);
        PricingPolicy saved = pricingPolicyRepository.save(policy);
        log.info("Bootstrapped paid pricing policy");
        return saved;
    }
/**
 * 确保defaultlocations已经准备好；如果不存在就自动创建。
 */
private Location ensureDefaultLocations() {
        List<Location> existing = locationRepository.findByIsDeletedOrderByLocationIdAsc(0);
        for (Location location : existing) {
            if ("ROOM".equals(location.getLocationType())) {
                return location;
            }
        }
        LocalDateTime now = LocalDateTime.now();
        Location building = new Location();
        building.setLocationCode("BLDG-A");
        building.setLocationName("Building A");
        building.setLocationType("BUILDING");
        building.setOpenTime(LocalTime.of(8, 0));
        building.setCloseTime(LocalTime.of(22, 0));
        building.setStatus("ACTIVE");
        building.setRemarks("Bootstrap building");
        building.setCreatedAt(now);
        building.setUpdatedAt(now);
        building.setIsDeleted(0);
        Location savedBuilding = locationRepository.save(building);
        Location zone = new Location();
        zone.setParentLocationId(savedBuilding.getLocationId());
        zone.setLocationCode("ZONE-A1");
        zone.setLocationName("Shared Learning Zone");
        zone.setLocationType("ZONE");
        zone.setFloorNo("1");
        zone.setOpenTime(LocalTime.of(8, 0));
        zone.setCloseTime(LocalTime.of(22, 0));
        zone.setStatus("ACTIVE");
        zone.setRemarks("Bootstrap zone");
        zone.setCreatedAt(now);
        zone.setUpdatedAt(now);
        zone.setIsDeleted(0);
        Location savedZone = locationRepository.save(zone);
        Location room = new Location();
        room.setParentLocationId(savedZone.getLocationId());
        room.setLocationCode("ROOM-A101");
        room.setLocationName("Room A101");
        room.setLocationType("ROOM");
        room.setFloorNo("1");
        room.setRoomNo("101");
        room.setOpenTime(LocalTime.of(8, 0));
        room.setCloseTime(LocalTime.of(22, 0));
        room.setStatus("ACTIVE");
        room.setRemarks("Bootstrap room");
        room.setCreatedAt(now);
        room.setUpdatedAt(now);
        room.setIsDeleted(0);
        Location savedRoom = locationRepository.save(room);
        log.info("Bootstrapped default locations");
        return savedRoom;
    }
/**
 * 确保defaultspaces已经准备好；如果不存在就自动创建。
 */
private void ensureDefaultSpaces(Location roomLocation, PricingPolicy freePolicy, PricingPolicy paidPolicy) {
        if (roomLocation == null || spaceRepository.count() > 0) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        Space quietStudy = createSpace(roomLocation.getLocationId(), freePolicy.getPolicyId(), "SPACE-A101-01", "Quiet Study Pod", "ROOM", 4, "Whiteboard, power sockets", 1, now);
        Space meetingRoom = createSpace(roomLocation.getLocationId(), paidPolicy.getPolicyId(), "SPACE-A101-02", "Project Meeting Room", "ROOM", 8, "Display, HDMI, whiteboard", 2, now);
        Space readingCorner = createSpace(roomLocation.getLocationId(), freePolicy.getPolicyId(), "SPACE-A101-03", "Reading Corner", "ROOM", 6, "Soft seating, lamps", 3, now);
        spaceRepository.saveAll(List.of(quietStudy, meetingRoom, readingCorner));
        log.info("Bootstrapped default spaces");
    }
/**
 * 创建空间。
 */
private Space createSpace(Long locationId, Long policyId, String code, String name, String type, int capacity, String equipment, int sortNo, LocalDateTime now) {
        Space space = new Space();
        space.setLocationId(locationId);
        space.setPolicyId(policyId);
        space.setSpaceCode(code);
        space.setSpaceName(name);
        space.setSpaceType(type);
        space.setCapacity(capacity);
        space.setEquipmentDesc(equipment);
        space.setStatus("ACTIVE");
        space.setSortNo(sortNo);
        space.setCreatedAt(now);
        space.setUpdatedAt(now);
        space.setIsDeleted(0);
        return space;
    }
/**
 * 构造DemoDataBootstrapRunner，并注入当前类运行所需的依赖对象。
 */
public DemoDataBootstrapRunner(final LocationRepository locationRepository, final PricingPolicyRepository pricingPolicyRepository, final SpaceRepository spaceRepository) {
        this.locationRepository = locationRepository;
        this.pricingPolicyRepository = pricingPolicyRepository;
        this.spaceRepository = spaceRepository;
    }
}
