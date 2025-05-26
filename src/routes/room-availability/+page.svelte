<script lang="ts">
    // Mock data based on the CSV (percentage removed)
    const roomAvailability = [
        {
            roomType: 'DBPK - Deluxe Balcony Pool View King',
            qty: 8,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 2 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 3 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 5 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 3 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 5 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 6 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 4 }
            ]
        },
        {
            roomType: 'DBPT - Deluxe Balcony Pool View Twin',
            qty: 2,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 0 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 0 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 1 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 1 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 1 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 1 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 1 }
            ]
        },
        {
            roomType: 'DLBT - Deluxe Balcony Twin',
            qty: 12,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 10 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 4 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 2 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 5 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 7 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 9 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 4 }
            ]
        },
        {
            roomType: 'DLXK - Deluxe King',
            qty: 28,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 8 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 3 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 10 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 3 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 12 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 10 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 5 }
            ]
        },
        {
            roomType: 'FRSK - Family Room Suite King',
            qty: 8,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 4 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 4 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 3 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 8 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 8 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 8 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 7 }
            ]
        },
        {
            roomType: 'GLSK - Gallery Suite King',
            qty: 4,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 3 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 2 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 1 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 3 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 3 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 3 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 3 }
            ]
        },
        {
            roomType: 'HILK - Hillside Studio King',
            qty: 16,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 2 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 12 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 15 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 16 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 16 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 16 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 16 }
            ]
        },
        {
            roomType: 'PRBK - Premier Balcony King',
            qty: 11,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 11 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 11 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 10 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 11 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 11 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 5 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 7 }
            ]
        },
        {
            roomType: 'PRBT - Premier Balcony Twin',
            qty: 9,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 8 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 7 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 8 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 9 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 9 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 9 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 9 }
            ]
        },
        {
            roomType: 'PRRK - Premier King',
            qty: 12,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 12 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 7 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 7 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 11 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 12 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 6 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 6 }
            ]
        },
        {
            roomType: 'PRSK - Premier Suite King',
            qty: 4,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 1 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 0 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 0 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 3 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 4 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 3 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 3 }
            ]
        },
        {
            roomType: 'PRRT - Premier Twin',
            qty: 9,
            availability: [
                { date: 'Aug 3, 2023', day: 'THURSDAY', available: 9 },
                { date: 'Aug 4, 2023', day: 'FRIDAY', available: 7 },
                { date: 'Aug 5, 2023', day: 'SATURDAY', available: 5 },
                { date: 'Aug 6, 2023', day: 'SUNDAY', available: 9 },
                { date: 'Aug 7, 2023', day: 'MONDAY', available: 8 },
                { date: 'Aug 8, 2023', day: 'TUESDAY', available: 8 },
                { date: 'Aug 9, 2023', day: 'WEDNESDAY', available: 8 }
            ]
        }
    ];

    // Calculate summary data from roomAvailability
    const dates = roomAvailability[0].availability.map((a) => ({ date: a.date, day: a.day }));
    const inventory = Array(dates.length).fill(roomAvailability.reduce((sum, r) => sum + r.qty, 0));
    const available = dates.map((_, i) => roomAvailability.reduce((sum, r) => sum + r.availability[i].available, 0));
    const sold = dates.map((_, i) => roomAvailability.reduce((sum, r) => sum + (r.qty - r.availability[i].available), 0));
    const opportunity = Array(dates.length).fill(0); // Placeholder, can be changed if needed
    const minSellable = [...available]; // Placeholder, can be changed if needed

    // For summary counts above the table
    const totalInventory = roomAvailability.reduce((sum, r) => sum + r.qty, 0);
    const totalAvailable = available.reduce((a, b) => a + b, 0);
    const totalPercentage = Math.round((totalAvailable / totalInventory) * 100);

    function getAvailabilityColor(percentage: number) {
        if (percentage >= 75) return 'bg-green-100 text-green-800';
        if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
        if (percentage >= 25) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    }
</script>

<div class="container mx-auto px-2 py-6">
    <!-- Summary Detail Section -->
    <div class="flex items-center space-x-4 mb-2">
        <div class="bg-blue-500 text-white px-3 py-1 rounded-t font-semibold text-sm shadow">Summary</div>
        <div class="text-black text-sm"><span class="font-bold">{totalInventory}</span> Count</div>
        <div class="text-black text-sm"><span class="font-bold text-blue-700">{totalInventory}</span> Percentage of Total</div>
        <div class="text-black text-sm"><span class="font-bold text-green-600">{totalInventory}</span> Available</div>
    </div>
    <hr class="mb-2 border-gray-300" />
    <!-- Summary Table -->
    <div class="overflow-x-auto mb-6">
        <table class="min-w-max border border-gray-300 text-xs bg-white">
            <thead>
                <tr class="bg-gray-100">
                    <th rowspan="2" class="border border-gray-300 px-2 py-1 text-left align-middle w-40">&nbsp;</th>
                    {#each dates as day}
                        <th class="border border-gray-300 px-2 py-1 text-center" colspan="1">{day.date}</th>
                    {/each}
                </tr>
                <tr class="bg-gray-50">
                    {#each dates as day}
                        <th class="border border-gray-300 px-2 py-1 text-center">{day.day}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="border border-gray-300 px-2 py-1 font-bold">Inventory</td>
                    {#each inventory as value}
                        <td class="border border-gray-300 px-2 py-1 text-center">{value}</td>
                    {/each}
                </tr>
                <tr>
                    <td class="border border-gray-300 px-2 py-1 font-bold">Sold</td>
                    {#each sold as value}
                        <td class="border border-gray-300 px-2 py-1 text-center">{value}</td>
                    {/each}
                </tr>
                <tr>
                    <td class="border border-gray-300 px-2 py-1 font-bold">Available</td>
                    {#each available as value}
                        <td class="border border-gray-300 px-2 py-1 text-center text-green-600 font-semibold">{value}</td>
                    {/each}
                </tr>
                <tr>
                    <td class="border border-gray-300 px-2 py-1 font-bold">Opportunity</td>
                    {#each opportunity as value}
                        <td class="border border-gray-300 px-2 py-1 text-center">{value}</td>
                    {/each}
                </tr>
                <tr>
                    <td class="border border-gray-300 px-2 py-1 text-blue-700">Minimum Sellable</td>
                    {#each minSellable as value}
                        <td class="border border-gray-300 px-2 py-1 text-center text-blue-700">{value}</td>
                    {/each}
                </tr>
            </tbody>
        </table>
    </div>
    <!-- End Summary Table -->
    <hr class="mb-2 border-gray-300" />
    <!-- Summary Detail Section -->
    <div class="flex items-center space-x-4 mb-2">
        <div class="bg-blue-500 text-white px-3 py-1 rounded-t font-semibold text-sm shadow">Details</div>
        <div class="text-black text-sm"><span class="font-bold">{totalInventory}</span> Count</div>
        <div class="text-red-600 text-sm">* Overbooking Limit</div>
        <div class="text-black text-sm"><span class="font-bold text-blue-600">{totalInventory}</span> Percentage of Total</div>
        <div class="text-black text-sm"><span class="font-bold text-green-600">{totalInventory}</span> Available</div>
        <label class="flex items-center space-x-1 text-sm cursor-pointer">
            <input type="checkbox" class="accent-gray-400" disabled />
            <span>Suite Component</span>
        </label>
        <div class="text-black text-sm"><span class="font-bold bg-yellow-200 border border-yellow-400 px-1">{totalInventory}</span> Physical Inventory</div>
    </div>
    <hr class="mb-2 border-gray-300" />
    <!-- End Summary Detail Section -->
    <div class="overflow-x-auto">
        <table class="min-w-max border border-gray-300 text-xs">
            <thead>
                <tr class="bg-gray-100">
                    <th rowspan="2" class="border border-gray-300 px-2 py-1 text-left align-middle">Room Type</th>
                    <th rowspan="2" class="border border-gray-300 px-2 py-1 text-center align-middle bg-blue-50">Qty</th>
                    {#each roomAvailability[0].availability as day}
                        <th class="border border-gray-300 px-2 py-1 text-center" colspan="2">{day.date}</th>
                    {/each}
                </tr>
                <tr class="bg-gray-50">
                    {#each roomAvailability[0].availability as day}
                        <th class="border border-gray-300 px-2 py-1 text-center" colspan="2">{day.day}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each roomAvailability as room}
                    <tr class="hover:bg-gray-50">
                        <td class="border border-gray-300 px-2 py-1 text-left font-medium">{room.roomType}</td>
                        <td class="border border-gray-300 px-2 py-1 text-center bg-blue-50 font-semibold">{room.qty}</td>
                        {#each room.availability as day}
                            {@const percent = Math.round((day.available / room.qty) * 100)}
                            <td class="border border-gray-300 px-2 py-1 text-center font-semibold">{day.available}</td>
                            <td class="border border-gray-300 px-2 py-1 text-center {getAvailabilityColor(percent)}">{percent}%</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    th[rowspan="2"] {
        vertical-align: middle;
    }
</style> 