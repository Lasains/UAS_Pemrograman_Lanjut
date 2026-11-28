<?php

namespace Tests\Unit;

use App\Models\IngredientBatch;
use Carbon\Carbon;
use Tests\TestCase;

class IngredientBatchExpiryTest extends TestCase
{
    public function test_days_until_expiry_and_status_are_accurate_for_carbon_3(): void
    {
        $expired = new IngredientBatch(['expiry_date' => Carbon::today()->subDays(2)]);
        $today = new IngredientBatch(['expiry_date' => Carbon::today()]);
        $warning = new IngredientBatch(['expiry_date' => Carbon::today()->addDays(5)]);
        $safe = new IngredientBatch(['expiry_date' => Carbon::today()->addDays(10)]);

        $this->assertSame(-2, $expired->days_until_expiry);
        $this->assertSame('critical', $expired->expiry_status);
        $this->assertSame('critical', $expired->urgency_status);

        $this->assertSame(0, $today->days_until_expiry);
        $this->assertSame('critical', $today->expiry_status);

        $this->assertSame(5, $warning->days_until_expiry);
        $this->assertSame('warning', $warning->expiry_status);

        $this->assertSame(10, $safe->days_until_expiry);
        $this->assertSame('safe', $safe->expiry_status);
    }
}
