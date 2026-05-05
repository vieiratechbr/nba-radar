import { NextResponse } from "next/server";
import {
  getNbaTodayDate,
  getNbaTomorrowDate,
  getNbaYesterdayDate,
  NBA_TIMEZONE
} from "@/utils/formatNbaApiDate";

export function GET() {
  return NextResponse.json({
    serverNow: new Date().toISOString(),
    nbaTimezone: NBA_TIMEZONE,
    nbaTodayYYYYMMDD: getNbaTodayDate(),
    nbaYesterdayYYYYMMDD: getNbaYesterdayDate(),
    nbaTomorrowYYYYMMDD: getNbaTomorrowDate()
  });
}
