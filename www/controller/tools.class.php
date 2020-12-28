<?php

class tools extends Controller{
    /**
     * ��ȡtraceroute����
     */
    public function traceroute() {
        $ip = $this->in['tracerouteip'];
        
        $last_line = system('traceroute -d ' .$ip, $retval);
        
        print_r($last_line);
    }
    
    /**
     * ��ȡtraceroute����
     */
    public function ping() {
        $ip = $this->in['pingip'];
        $count = $this->in['pingcount'];
        $size = $this->in['pingsize'];

        $last_line = system('/usr/sbin/ping -c ' .$count . ' -s ' .$size . '  ' .$ip, $retval);
        
        print_r($last_line);
    }
}