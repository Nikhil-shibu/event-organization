"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Calendar, Users, Edit, Trash2, Search, MapPin, Clock, Star, LogOut } from "lucide-react"
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
  status: "upcoming" | "past" | "ongoing"
  category: string
  created_by?: any
}

export default function Component() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const currentUser = getCurrentUser()

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
    category: "",
  })

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!currentUser || currentUser.user_type !== 'admin') {
      router.push('/')
    }
  }, [currentUser, router])

  // Fetch events
  useEffect(() => {
    fetchEvents()
  }, [activeTab])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsAPI.getEvents()
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    removeAuthTokens()
    router.push('/')
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === 'upcoming') {
      // Show upcoming and ongoing events for admins
      return (event.status === 'upcoming' || event.status === 'ongoing') && matchesSearch
    } else {
      // Show past events
      return event.status === 'past' && matchesSearch
    }
  })

  const handleCreateEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      try {
        const eventData = {
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          max_participants: parseInt(newEvent.maxParticipants) || 0,
          category: newEvent.category,
        }
        
        await eventsAPI.createEvent(eventData)
        setNewEvent({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          maxParticipants: "",
          category: "",
        })
        setShowCreateModal(false)
        fetchEvents() // Refresh events list
      } catch (error) {
        console.error('Error creating event:', error)
        setError('Failed to create event')
      }
    }
  }

  const handleUpdateEvent = async () => {
    if (editingEvent) {
      try {
        const eventData = {
          title: editingEvent.title,
          description: editingEvent.description,
          date: editingEvent.date,
          time: editingEvent.time,
          location: editingEvent.location,
          max_participants: editingEvent.max_participants,
          category: editingEvent.category,
        }
        
        await eventsAPI.updateEvent(editingEvent.id, eventData)
        setEditingEvent(null)
        fetchEvents() // Refresh events list
      } catch (error) {
        console.error('Error updating event:', error)
        setError('Failed to update event')
      }
    }
  }

  const handleDeleteEvent = async (id: number) => {
    try {
      await eventsAPI.deleteEvent(id)
      fetchEvents() // Refresh events list
    } catch (error) {
      console.error('Error deleting event:', error)
      setError('Failed to delete event')
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

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Event Management
              </h1>
              <p className="text-gray-600 mt-2">Manage all your events.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl text-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-blue-600">{events.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl text-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {events.filter((e) => e.status === "upcoming" || e.status === "ongoing").length}
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
                  <p className="text-gray-600">Total Participants</p>
                  <p className="text-3xl font-bold text-cyan-600">
                    {events.reduce((sum, event) => sum + event.current_participants, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-600" />
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
                  variant={activeTab === "upcoming" ? "default" : "outline"}
                  onClick={() => setActiveTab("upcoming")}
                  className={`rounded-xl ${
                    activeTab === "upcoming"
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Upcoming
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
                  Past
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
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    {/* Participants */}
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Participants</span>
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {event.current_participants}/{event.max_participants}
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-700 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(event.current_participants / event.max_participants) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingEvent(event)}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="border-red-300 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
                {activeTab === "upcoming"
                  ? "No upcoming events. Create your first event!"
                  : "No past events to display."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl text-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Create New Event
              </CardTitle>
              <CardDescription className="text-gray-600">Fill in the details for your new event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-800">
                    Event Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-gray-800">
                    Category
                  </Label>
                  <Input
                    id="category"
                    placeholder="e.g., Fashion, Wellness"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800 placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-800">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe your event..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none h-24 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date" className="text-gray-800">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-gray-800">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="maxParticipants" className="text-gray-800">
                    Max Participants
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="100"
                    value={newEvent.maxParticipants}
                    onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800 placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-gray-800">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateEvent}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-xl"
                >
                  Create Event
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl text-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Edit Event
              </CardTitle>
              <CardDescription className="text-gray-600">Update your event details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title" className="text-gray-800">
                    Event Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category" className="text-gray-800">
                    Category
                  </Label>
                  <Input
                    id="edit-category"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-gray-800">
                  Description
                </Label>
                <textarea
                  id="edit-description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none h-24 text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-date" className="text-gray-800">
                    Date
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time" className="text-gray-800">
                    Time
                  </Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxParticipants" className="text-gray-800">
                    Max Participants
                  </Label>
                  <Input
                    id="edit-maxParticipants"
                    type="number"
                    value={editingEvent.max_participants}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, max_participants: Number.parseInt(e.target.value) })
                    }
                    className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-location" className="text-gray-800">
                  Location
                </Label>
                <Input
                  id="edit-location"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-800"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdateEvent}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-xl"
                >
                  Update Event
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
