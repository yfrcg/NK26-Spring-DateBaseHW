package com.mycourse.db_backend.reservation;

import com.mycourse.db_backend.account.UserAccount;
import com.mycourse.db_backend.account.UserAccountRepository;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.pricing.PricingPolicyRepository;
import com.mycourse.db_backend.space.SpaceRepository;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceImplTest {

    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private SpaceTimeLockRepository lockRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SpaceRepository spaceRepository;
    @Mock
    private PricingPolicyRepository pricingPolicyRepository;
    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private ReservationServiceImpl reservationService;

    @Test
    void createReservationShouldRejectUsersWithArrears() {
        ReservationCreateRequest request = new ReservationCreateRequest();
        request.setUserId(1L);
        request.setSpaceId(2L);
        request.setStartTime(LocalDateTime.now().plusHours(2));
        request.setEndTime(LocalDateTime.now().plusHours(4));

        User user = new User();
        user.setUserId(1L);
        user.setAccountStatus("ACTIVE");
        user.setIsDeleted(0);

        UserAccount account = new UserAccount();
        account.setUserId(1L);
        account.setArrearsAmount(new BigDecimal("12.50"));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userAccountRepository.findById(1L)).thenReturn(Optional.of(account));

        assertThrows(BusinessException.class, () -> reservationService.createReservation(request));

        verify(spaceRepository, never()).findById(2L);
        verify(reservationRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }
}
