"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Users, Search, MapPin, Clock, Heart, X, Check, Star, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { eventsAPI, getCurrentUser, removeAuthTokens } from "@/lib/api"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  max_participants: number
  current_participants: number
  status: "ongoing" | "past" | "upcoming"
  category: string
  userStatus?: "joined" | "skipped" | "pending"
}

export default function Component() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "past">("ongoing")
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [participations, setParticipations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const currentUser = getCurrentUser()

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!currentUser) {
      router.push('/')
    }
  }, [currentUser, router])

  // Fetch events and participations
  useEffect(() => {
    fetchEvents()
    fetchParticipations()
  }, [activeTab])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const status = activeTab === 'ongoing' ? 'upcoming' : 'past'
      const response = await eventsAPI.getEvents(status)
      setEvents(response.data.map((event: any) => ({
        ...event,
        userStatus: getUserParticipationStatus(event.id)
      })))
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const fetchParticipations = async () => {
    try {
      const response = await eventsAPI.getUserParticipations()
      setParticipations(response.data)
    } catch (error) {
      console.error('Error fetching participations:', error)
    }
  }

  const getUserParticipationStatus = (eventId: number) => {
    const participation = participations.find(p => p.event.id === eventId)
    return participation?.status || 'pending'
  }

  const handleLogout = () => {
    removeAuthTokens()
    router.push('/')
  }

  const filteredEvents = events.filter(
    (event) => event.status === activeTab && event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleParticipation = async (eventId: number, status: "joined" | "skipped") => {
    try {
      if (status === 'joined') {
        await eventsAPI.joinEvent(eventId)
      } else {
        await eventsAPI.skipEvent(eventId)
      }
      
      // Refresh data
      fetchEvents()
      fetchParticipations()
    } catch (error) {
      console.error('Error updating participation:', error)
      setError('Failed to update participation')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "joined":
        return "bg-green-100 text-green-600 border-green-200"
      case "skipped":
        return "bg-red-100 text-red-600 border-red-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "joined":
        return "Joined"
      case "skipped":
        return "Skipped"
      default:
        return "Pending"
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Welcome, {currentUser?.first_name || 'Student'}!
              </h1>
              <p className="text-gray-600 mt-2">Discover amazing events and join the fun.</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl text-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Events Joined</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {events.filter((e) => e.userStatus === "joined").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl text-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ongoing Events</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {events.filter((e) => e.status === "ongoing").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl text-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Past Events</p>
                  <p className="text-3xl font-bold text-cyan-600">{events.filter((e) => e.status === "past").length}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl mb-6 text-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "ongoing" ? "default" : "outline"}
                  onClick={() => setActiveTab("ongoing")}
                  className={`rounded-xl ${
                    activeTab === "ongoing"
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Ongoing Events
                </Button>
                <Button
                  variant={activeTab === "past" ? "default" : "outline"}
                  onClick={() => setActiveTab("past")}
                  className={`rounded-xl ${
                    activeTab === "past"
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Past Events
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200 text-gray-800"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.userStatus || "pending")}`}
                      >
                        {getStatusText(event.userStatus || "pending")}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {event.current_participants}/{event.max_participants} participants
                      </span>
                      <div className="flex-1 max-w-32 bg-gray-200 rounded-full h-2 ml-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-700 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (event.current_participants / event.max_participants) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {activeTab === "ongoing" && (
                    <div className="flex flex-col justify-center gap-3 lg:w-48">
                      <Button
                        onClick={() => handleParticipation(event.id, "joined")}
                        disabled={event.current_participants >= event.max_participants && event.userStatus !== "joined"}
                        className={`h-12 rounded-xl transition-all duration-200 ${
                          event.userStatus === "joined"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white"
                        }`}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {event.userStatus === "joined" ? "Joined!" : "Will Join"}
                      </Button>

                      <Button
                        onClick={() => handleParticipation(event.id, "skipped")}
                        variant="outline"
                        className={`h-12 rounded-xl transition-all duration-200 ${
                          event.userStatus === "skipped"
                            ? "border-red-300 bg-red-100 text-red-600"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <X className="w-4 h-4 mr-2" />
                        {event.userStatus === "skipped" ? "Skipped" : "Will Skip"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl text-gray-800">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">
                {activeTab === "ongoing"
                  ? "No ongoing events at the moment. Check back soon!"
                  : "No past events to display."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
