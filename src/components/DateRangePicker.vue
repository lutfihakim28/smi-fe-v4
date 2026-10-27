<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { DateFormatter, getLocalTimeZone, CalendarDate, today } from '@internationalized/date'
import { Range } from '../types';

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
})

const selected = defineModel<Range>({ required: true })

const ranges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', months: 3 },
  { label: 'Last 6 months', months: 6 },
  { label: 'Last year', years: 1 }
]

const toCalendarDate = (date: Date) => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

type CalendarRange = {
  start: CalendarDate | undefined
  end: CalendarDate | undefined
}

// The calendar needs to hold a start without an end, so picking a new start clears the old end.
// shallowRef keeps CalendarDate's private fields intact (deep unwrapping breaks its type).
const calendarRange = shallowRef<CalendarRange>({
  start: toCalendarDate(selected.value.start),
  end: toCalendarDate(selected.value.end)
})

watch(selected, (range) => {
  const start = toCalendarDate(range.start)
  const end = toCalendarDate(range.end)

  // Ignore the echo of a range this picker just committed, and never overwrite a pending start.
  if (start.toString() === calendarRange.value.start?.toString()
    && end.toString() === calendarRange.value.end?.toString()) return

  calendarRange.value = { start, end }
})

watch(calendarRange, (range) => {
  if (!range.start || !range.end) return

  const start = range.start.toDate(getLocalTimeZone())
  const end = range.end.toDate(getLocalTimeZone())

  // Skip the echo from syncing an externally selected range back into the calendar.
  if (start.getTime() === selected.value.start.getTime()
    && end.getTime() === selected.value.end.getTime()) return

  selected.value = { start, end }
})

const isRangeSelected = (range: { days?: number, months?: number, years?: number }) => {
  if (!selected.value.start || !selected.value.end) return false

  const currentDate = today(getLocalTimeZone())
  let startDate = currentDate.copy()

  if (range.days) {
    startDate = startDate.subtract({ days: range.days })
  } else if (range.months) {
    startDate = startDate.subtract({ months: range.months })
  } else if (range.years) {
    startDate = startDate.subtract({ years: range.years })
  }

  const selectedStart = toCalendarDate(selected.value.start)
  const selectedEnd = toCalendarDate(selected.value.end)

  return selectedStart.compare(startDate) === 0 && selectedEnd.compare(currentDate) === 0
}

const selectRange = (range: { days?: number, months?: number, years?: number }) => {
  const endDate = today(getLocalTimeZone())
  let startDate = endDate.copy()

  if (range.days) {
    startDate = startDate.subtract({ days: range.days })
  } else if (range.months) {
    startDate = startDate.subtract({ months: range.months })
  } else if (range.years) {
    startDate = startDate.subtract({ years: range.years })
  }

  selected.value = {
    start: startDate.toDate(getLocalTimeZone()),
    end: endDate.toDate(getLocalTimeZone())
  }
}
</script>

<template>
  <UPopover :content="{ align: 'start' }" :modal="true">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-calendar"
      class="data-[state=open]:bg-elevated group"
    >
      <span class="truncate">
        <template v-if="calendarRange.start">
          <template v-if="calendarRange.end">
            {{ df.format(calendarRange.start.toDate(getLocalTimeZone())) }} - {{ df.format(calendarRange.end.toDate(getLocalTimeZone())) }}
          </template>
          <template v-else>
            {{ df.format(calendarRange.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>
        <template v-else>
          Pick a date
        </template>
      </span>

      <template #trailing>
        <UIcon name="i-lucide-chevron-down" class="shrink-0 text-dimmed size-5 group-data-[state=open]:rotate-180 transition-transform duration-200" />
      </template>
    </UButton>

    <template #content>
      <div class="flex items-stretch sm:divide-x divide-default">
        <div class="hidden sm:flex flex-col justify-center">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="neutral"
            variant="ghost"
            class="rounded-none px-4"
            :class="[isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50']"
            truncate
            @click="selectRange(range)"
          />
        </div>

        <UCalendar
          v-model="calendarRange"
          class="p-2"
          :number-of-months="2"
          range
        />
      </div>
    </template>
  </UPopover>
</template>
