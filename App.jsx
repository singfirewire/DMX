import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { 
  Lightbulb, 
  Power, 
  Palette, 
  Settings, 
  Play, 
  Pause, 
  Square, 
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react'
import './App.css'

function App() {
  // State สำหรับการจัดการไฟ PAR
  const [fixtures, setFixtures] = useState([
    { id: 1, name: 'PAR 1', address: 1, red: 0, green: 0, blue: 0, white: 0, dimmer: 100, strobe: 0, mode: 0, enabled: true },
    { id: 2, name: 'PAR 2', address: 8, red: 0, green: 0, blue: 0, white: 0, dimmer: 100, strobe: 0, mode: 0, enabled: true },
    { id: 3, name: 'PAR 3', address: 15, red: 0, green: 0, blue: 0, white: 0, dimmer: 100, strobe: 0, mode: 0, enabled: true },
    { id: 4, name: 'PAR 4', address: 22, red: 0, green: 0, blue: 0, white: 0, dimmer: 100, strobe: 0, mode: 0, enabled: true }
  ])

  // State สำหรับซีน
  const [scenes, setScenes] = useState([
    { id: 1, name: 'Red Wash', color: '#ff0000' },
    { id: 2, name: 'Blue Wash', color: '#0000ff' },
    { id: 3, name: 'Green Wash', color: '#00ff00' },
    { id: 4, name: 'White Wash', color: '#ffffff' },
    { id: 5, name: 'Purple Wash', color: '#800080' },
    { id: 6, name: 'Orange Wash', color: '#ffa500' }
  ])

  // State สำหรับการควบคุม
  const [masterDimmer, setMasterDimmer] = useState([100])
  const [selectedFixtures, setSelectedFixtures] = useState([])
  const [currentScene, setCurrentScene] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentColor, setCurrentColor] = useState('#ffffff')

  // ฟังก์ชันสำหรับอัปเดตค่าของไฟ
  const updateFixture = (id, property, value) => {
    setFixtures(prev => prev.map(fixture => 
      fixture.id === id ? { ...fixture, [property]: value } : fixture
    ))
  }

  // ฟังก์ชันสำหรับอัปเดตไฟที่เลือก
  const updateSelectedFixtures = (property, value) => {
    setFixtures(prev => prev.map(fixture => 
      selectedFixtures.includes(fixture.id) ? { ...fixture, [property]: value } : fixture
    ))
  }

  // ฟังก์ชันสำหรับเลือก/ยกเลิกการเลือกไฟ
  const toggleFixtureSelection = (id) => {
    setSelectedFixtures(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    )
  }

  // ฟังก์ชันสำหรับใช้ซีน
  const applyScene = (scene) => {
    const color = hexToRgb(scene.color)
    if (color) {
      setFixtures(prev => prev.map(fixture => ({
        ...fixture,
        red: color.r,
        green: color.g,
        blue: color.b,
        white: 0
      })))
      setCurrentScene(scene.id)
    }
  }

  // ฟังก์ชันแปลงสีจาก hex เป็น RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // ฟังก์ชันสำหรับใช้สีกับไฟที่เลือก
  const applyColorToSelected = () => {
    const color = hexToRgb(currentColor)
    if (color && selectedFixtures.length > 0) {
      updateSelectedFixtures('red', color.r)
      updateSelectedFixtures('green', color.g)
      updateSelectedFixtures('blue', color.b)
    }
  }

  // ฟังก์ชันสำหรับปิดไฟทั้งหมด
  const blackout = () => {
    setFixtures(prev => prev.map(fixture => ({
      ...fixture,
      red: 0,
      green: 0,
      blue: 0,
      white: 0,
      dimmer: 0
    })))
    setCurrentScene(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            DMX PAR Light Controller
          </h1>
          <p className="text-slate-300">ระบบควบคุมไฟพาร์แบบมืออาชีพ</p>
        </div>

        {/* Master Controls */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              การควบคุมหลัก
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Master Dimmer</Label>
                <Slider
                  value={masterDimmer}
                  onValueChange={setMasterDimmer}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-sm text-slate-400">{masterDimmer[0]}%</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant={isPlaying ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'หยุด' : 'เล่น'}
                </Button>
                <Button onClick={blackout} variant="outline" className="flex-1">
                  <Square className="h-4 w-4 mr-2" />
                  Blackout
                </Button>
              </div>
              <div className="space-y-2">
                <Label>เลือกสี</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-12 h-10 rounded border-2 border-slate-600"
                  />
                  <Button onClick={applyColorToSelected} disabled={selectedFixtures.length === 0}>
                    ใช้สี
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>ไฟที่เลือก</Label>
                <div className="text-sm text-slate-400">
                  {selectedFixtures.length > 0 ? `${selectedFixtures.length} ดวง` : 'ไม่มี'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fixture Control */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-400" />
                  การควบคุมไฟ PAR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixtures.map((fixture) => (
                    <Card 
                      key={fixture.id} 
                      className={`bg-slate-700/50 border-slate-600 cursor-pointer transition-all ${
                        selectedFixtures.includes(fixture.id) ? 'ring-2 ring-purple-400' : ''
                      }`}
                      onClick={() => toggleFixtureSelection(fixture.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{fixture.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">DMX {fixture.address}</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateFixture(fixture.id, 'enabled', !fixture.enabled)
                              }}
                            >
                              {fixture.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Color Preview */}
                        <div 
                          className="h-8 rounded border-2 border-slate-600"
                          style={{
                            backgroundColor: `rgb(${fixture.red}, ${fixture.green}, ${fixture.blue})`,
                            opacity: fixture.dimmer / 100
                          }}
                        />
                        
                        {/* RGB Controls */}
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs text-red-400">Red</Label>
                            <Slider
                              value={[fixture.red]}
                              onValueChange={(value) => updateFixture(fixture.id, 'red', value[0])}
                              max={255}
                              className="mt-1"
                            />
                            <div className="text-xs text-center text-slate-400">{fixture.red}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-green-400">Green</Label>
                            <Slider
                              value={[fixture.green]}
                              onValueChange={(value) => updateFixture(fixture.id, 'green', value[0])}
                              max={255}
                              className="mt-1"
                            />
                            <div className="text-xs text-center text-slate-400">{fixture.green}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-blue-400">Blue</Label>
                            <Slider
                              value={[fixture.blue]}
                              onValueChange={(value) => updateFixture(fixture.id, 'blue', value[0])}
                              max={255}
                              className="mt-1"
                            />
                            <div className="text-xs text-center text-slate-400">{fixture.blue}</div>
                          </div>
                        </div>

                        {/* White and Dimmer */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">White</Label>
                            <Slider
                              value={[fixture.white]}
                              onValueChange={(value) => updateFixture(fixture.id, 'white', value[0])}
                              max={255}
                              className="mt-1"
                            />
                            <div className="text-xs text-center text-slate-400">{fixture.white}</div>
                          </div>
                          <div>
                            <Label className="text-xs">Dimmer</Label>
                            <Slider
                              value={[fixture.dimmer]}
                              onValueChange={(value) => updateFixture(fixture.id, 'dimmer', value[0])}
                              max={100}
                              className="mt-1"
                            />
                            <div className="text-xs text-center text-slate-400">{fixture.dimmer}%</div>
                          </div>
                        </div>

                        {/* Strobe */}
                        <div>
                          <Label className="text-xs">Strobe</Label>
                          <Slider
                            value={[fixture.strobe]}
                            onValueChange={(value) => updateFixture(fixture.id, 'strobe', value[0])}
                            max={255}
                            className="mt-1"
                          />
                          <div className="text-xs text-center text-slate-400">{fixture.strobe}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scene Control */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-pink-400" />
                  ซีนแสง
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {scenes.map((scene) => (
                    <Button
                      key={scene.id}
                      onClick={() => applyScene(scene)}
                      variant={currentScene === scene.id ? "default" : "outline"}
                      className="h-16 flex flex-col items-center justify-center gap-1"
                    >
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white"
                        style={{ backgroundColor: scene.color }}
                      />
                      <span className="text-xs">{scene.name}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มซีนใหม่
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    บันทึกซีนปัจจุบัน
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* DMX Status */}
            <Card className="mt-6 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-400" />
                  สถานะ DMX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">การเชื่อมต่อ</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      เชื่อมต่อแล้ว
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Universe</span>
                    <span className="text-sm text-slate-400">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ช่องที่ใช้</span>
                    <span className="text-sm text-slate-400">29/512</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">FPS</span>
                    <span className="text-sm text-slate-400">44</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
